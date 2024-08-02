import fitmatch from "./../api/Fitmatch.js";
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import User from "./../api/User.js";
import { validateRegisterCredentials, isValidEmail } from "./../api/utils/Validate.js";
import { buildInternalErrorPacket, buildInvalidPacket, buildTokenPacket } from "./../api/packets/PacketBuilder.js";
import passport from "passport";

const router = express.Router();

const TOKEN_EXPIRE_TIME = 48 * 60 * 60 * 1000;

const GoogleStrategy = g.Strategy;

passport.use(new GoogleStrategy({
    clientID: fitmatch.config.google_client_id,
    clientSecret: fitmatch.config.client_secret,
    callbackURL: fitmatch.config.callbackURL
},
    function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res, next) => {
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
        const data = e[0];
        if (!data.length) {
            response.json(buildInvalidPacket("The data introduced is incorrect. 1"));
            return;
        }
        if (data.length > 1) {
            response.json(buildInternalErrorPacket("Internal error, this field is duplicated."));
            return;
        }
        const user = data[0];
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
                response.json(buildInvalidPacket("The data introduced is incorrect. 2"));
                return;
            }
        }).catch(err => {
            response.json(buildInternalErrorPacket("Internal error, could not compare passwords."));
            console.log(err);
            return;
        })
    });
});

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

    bcrypt.hash(password, 10)
        .then(e => {
            fitmatch.sqlManager.createNewUser(name, lastname ? lastname : null, email, phone ? phone : null, e)
                .then(e => {
                    fitmatch.sqlManager.getUserFromEmail(email)
                        .then(e => {
                            const data = e[0];
                            const user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, null, null, data.isSetup);
                            fitmatch.userManager.put(user.id, user);
                            const token = createToken(request.ip, user.id);
                            response.json(buildTokenPacket(token, false));
                        })
                        .catch(err => {
                            console.log("An error ocurred trying to send a query. Error: " + err);
                            response.json(buildInternalErrorPacket("Backend internal error. Check logs if you are an admin."))
                        });
                })
                .catch(err => {
                    console.log("An error ocurred trying to send a query. Error: " + err);
                    response.json(buildInternalErrorPacket("Backend internal error. Check logs if you are an admin."));
                })
        })
});

function createToken(ip, userId) {
    return jwt.sign({
        ip: ip,
        userId: userId,
        expiredAt: new Date().getTime() + TOKEN_EXPIRE_TIME
    }, fitmatch.config.tokenSecretKey);
}

export default router;