import fitmatch from "./../api/Fitmatch.js";
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import User from "./../api/User.js";
import { OAuth2Client } from "google-auth-library";
import { validateRegisterCredentials, isValidEmail, tokenRequired } from "./../api/utils/Validate.js";
import { buildInternalErrorPacket, buildInvalidPacket, buildSimpleOkPacket, buildTokenPacket } from "./../api/packets/PacketBuilder.js";

// Providers
const GOOGLE = "google";
const LOCAL = "local";

const client = new OAuth2Client(fitmatch.config.google_client_id);

const router = express.Router();

const TOKEN_EXPIRE_TIME = 48 * 60 * 60 * 1000;

router.post("/google", async (req, res, next) => {
    if (!req.body.token) {
        res.json(buildInvalidPacket("A token is required."));
    }
    
    const token = req.body.token;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: fitmatch.config.google_client_id
    });
    const payload = ticket.getPayload();

    const name = payload.name;
    const lastname = payload.family_name;
    const email = payload.email;

    register(name, lastname, GOOGLE, email, null, null, req, res);
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
            response.json(buildInternalErrorPacket("Internal error, this field is duplicated."));
            return;
        }
        const data = e[0];
        const hash = data.pwhash;
        bcrypt.compare(password, hash).then(e => {
            if (e) {
                const user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, data.city, data.latitude, data.longitude, data.isSetup, data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday, data.sunday, data.timetable1, data.timetable2);
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
    fitmatch.sqlManager.getUserFromNumber(phone)
        .then(e => {
            const data = e;
            if (data.length) {
                response.json(buildInvalidPacket("This number is already in use."));
                return;
            }
            if (provider === GOOGLE) {
                fitmatch.getSqlManager().createNewUser(name, lastname, provider, email, phone, password)
                .then(e => {
                    fitmatch.getSqlManager().getUserFromEmail(email)
                    .then(e => {
                        const data = e[0];
                        const user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences.split(";"), data.img, data.city, parseFloat(data.latitude), parseFloat(data.longitude), data.isSetup, data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday, data.sunday, data.timetable1, data.timetable2);
                        fitmatch.userManager.put(user.id, user);
                        const token = createToken(request.ip, user.id);
                        response.json(buildTokenPacket(token, false));
                        return;
                    })
                })
                .catch(err => {
                    console.log(err);
                    response.json(buildInternalErrorPacket("Backend internal error. Check logs."));
                    return;
                });
            } else {
                bcrypt.hash(password, 10)
                .then(e => {
                    fitmatch.sqlManager.createNewUser(name, lastname, provider, email, phone, e)
                    .then(e => {
                        fitmatch.sqlManager.getUserFromEmail(email)
                        .then(e => {
                            const data = e;
                            const user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, data.city, data.latitude, data.longitude, data.isSetup, data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday, data.sunday, data.timetable1, data.timetable2);
                            fitmatch.userManager.put(user.id, user);
                            const token = createToken(request.ip, user.id);
                            response.json(buildTokenPacket(token, false));
                        })
                    })
                    .catch(err => {
                        console.log("An error ocurred trying to send a query. Error: " + err);
                        response.json(buildInternalErrorPacket("Backend internal error. Check logs if you are an admin."));
                        return;
                    })
                })
            }
        })
        .catch(err => {
            console.log("An error ocurred trying to send a query. Error: " + err);
            response.json(buildInternalErrorPacket("Backend internal error. Check logs if you are an admin."));
            return;
        });
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
    // TODO fix double email error.
    const name = request.body.name;
    const lastname = request.body.lastname ? request.body.lastname : null;
    const email = request.body.email ? request.body.email : null;
    const phone = request.body.phone;
    const password = request.body.password;

    if (!name || !phone || !password) {
        console.log(`${name}, ${phone}`)
        response.json(buildInvalidPacket("There is invalid data."));
        return;
    }

    register(name, lastname, LOCAL, email, phone, password, request, response);
});

router.get("/validate-token", tokenRequired, function (request, response, next) {
    response.json(buildSimpleOkPacket());
});

function createToken(ip, userId) {
    return jwt.sign({
        ip: ip,
        id: userId,
        expiredAt: new Date().getTime() + TOKEN_EXPIRE_TIME
    }, fitmatch.config.tokenSecretKey);
}

export default router;