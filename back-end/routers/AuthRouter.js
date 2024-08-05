import fitmatch from "./../api/Fitmatch.js";
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import User from "./../api/User.js";
import { OAuth2Client } from "google-auth-library";
import { validateRegisterCredentials, isValidEmail } from "./../api/utils/Validate.js";
import { buildInternalErrorPacket, buildInvalidPacket, buildTokenPacket } from "./../api/packets/PacketBuilder.js";

// Providers
const GOOGLE = "google";
const LOCAL = "local";

const client = new OAuth2Client(fitmatch.config.google_client_id);

const router = express.Router();

const TOKEN_EXPIRE_TIME = 48 * 60 * 60 * 1000;

router.post("/google", async (req, res, next) => {
    if (!req.body.token) {
        console.log(req);
        res.json(buildInvalidPacket("A token is required."));
    }
    
    const token = req.body.token;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: fitmatch.config.google_client_id
    });
    const payload = ticket.getPayload();
    const userId = payload['sub'];

    const name = payload.name;
    const lastname = payload.family_name;
    const email = payload.email;
    const phone = null;

    register(name, lastname, GOOGLE, email, phone, null, req, res);
});

router.get("/google/callback", (req, res, next) => {
    console.log(req);
    res.redirect("/");
})

/**
 * Data this endpoint expects:
 * {
 *      "headers": {...}
 *      "body": {
 *          email or phone (field),
 *          password
 *      }
 * }
 */
router.post("/login", (request, response, next) => {
    const field = request.body.field;
    const password = request.body.password;
    let promise;
    if (isValidEmail(field)) {
        promise = fitmatch.getSqlManager().getUserFromEmail(field);
    } else {
        promise = fitmatch.getSqlManager().getUserFromNumber(field);
    }
    promise.then(e => {
        if (!e.length) {
            response.json(buildInvalidPacket("The data introduced is incorrect."));
            return;
        }
        if (e.length > 1) {
            console.log(e);
            response.json(buildInternalErrorPacket("Internal error, this field is duplicated."));
            return;
        }
        const user = e[0];
        console.log(user);
        const hash = user.pwhash;
        console.log(password);
        console.log(hash);
        bcrypt.compare(password, hash).then(e => {
            console.log(e);
            if (e) {
                fitmatch.getUserManager().put(user.id, user);
                response.json(buildTokenPacket(createToken(request.ip, user.id), user.isSetup));
                return;
            } else {
                response.json(buildInvalidPacket("The data introduced is incorrect."));
                return;
            }
        }).catch(err => {
            response.json(buildInternalErrorPacket("Internal error, could not compare passwords."));
            console.log(err);
            return;
        })
    });
});

function register(name, lastname, provider, email, phone, password, request, response) {
    let cancel = false;
    fitmatch.sqlManager.getUserFromEmail(email)
        .then(e => {
            const data = e[0];
            if (data.length) {
                response.json(buildInvalidPacket("This email is already in use."));
                cancel = true;
                return;
            }
        })
        .catch(err => {
            console.log("An error ocurred trying to send a query. Error: " + err);
            response.json(buildInternalErrorPacket("Backend internal error. Check logs if you are an admin."));
        });
    if (cancel) return;
    if (provider === GOOGLE) {
        fitmatch.getSqlManager().createNewUser(name, lastname, provider, email, phone, password)
        .then(e => {
            fitmatch.getSqlManager().getUserFromEmail(email)
            .then(e => {
                const data = e[0];
                const user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences.split(";"), data.img, data.city, parseFloat(data.latitude), parseFloat(data.longitude), data.isSetup);
                fitmatch.userManager.put(user.id, user);
                const token = createToken(request.ip, user.id);
                response.json(buildTokenPacket(token, false));
            })
        })
        .catch(err => {
            console.log(err);
            response.json(buildInternalErrorPacket("Backend internal error. Check logs."));
        });
    } else {
        console.log("else arriba");
        bcrypt.hash(password, 10)
        .then(e => {
            console.log("fa el hash");
            fitmatch.sqlManager.createNewUser(name, lastname, provider, email, phone, e)
            .then(e => {
                console.log("fa el create user");
                fitmatch.sqlManager.getUserFromEmail(email)
                .then(e => {
                    console.log("fa l'ultim get");
                    const data = e[0];
                    const user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, null, null, data.isSetup);
                    fitmatch.userManager.put(user.id, user);
                    const token = createToken(request.ip, user.id);
                    response.json(buildTokenPacket(token, false));
                })
            })
            .catch(err => {
                console.log("An error ocurred trying to send a query. Error: " + err);
                response.json(buildInternalErrorPacket("Backend internal error. Check logs if you are an admin."));
            })
        })
    }
    
};


/**
 * Data this endpoint expects:
 * {
 *      "headers": {...},
 *      "body": {
 *          name,
 *          lastname (optional, nullable),
 *          email,
 *          phone (optional, nullable),
 *          password (plain password text)
 *      }
 * }
 */
router.post("/register", validateRegisterCredentials, (request, response, next) => {
    const name = request.body.name;
    const lastname = request.body.lastname;
    const email = request.body.email;
    const phone = request.body.phone;
    const password = request.body.password;

    register(name, lastname, LOCAL, email, phone, password, request, response);
});

router.get("/validate-token", function (request, response, next) {
    const token = request.headers['authorization'].split(' ')[1];

    jwt.verify(token, fitmatch.getConfig().tokenSecretKey, (err, decoded) => {
        if (err) {
            return response.status(401).json({ valid: false, message: 'Invalid token.' });
        }
        if (decoded.expiredAt < new Date().getTime()) {
            return response.status(401).json({ valid: false, message: 'Token expired.' });
        }
        response.json({ valid: true });
    });
});

function createToken(ip, userId) {
    return jwt.sign({
        ip: ip,
        userId: userId,
        expiredAt: new Date().getTime() + TOKEN_EXPIRE_TIME
    }, fitmatch.config.tokenSecretKey);
}

export default router;