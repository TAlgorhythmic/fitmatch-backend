import fitmatch from "./../api/Fitmatch.js";
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import User from "./../api/User.js";
import { validateRegisterCredentials, isValidEmail } from "./../api/utils/Validate.js";
import { buildInternalErrorPacket, buildInvalidPacket, buildTokenPacket } from "./../api/packets/PacketBuilder.js";

const router = express.Router();

const TOKEN_EXPIRE_TIME = 48 * 60 * 60 * 1000;

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
        if (data.length < 1) {
            response.json(buildInvalidPacket("The data introduced is incorrect."));
            return;
        }
        if (data.length > 1) {
            response.json(buildInternalErrorPacket("Internal error, this field is duplicated."));
            return;
        }
        const user = data[0];
        const salt = user.salt;
        const hash = user.pwhash;
        bcrypt.compare(password + salt, hash).then(e => {
            
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
    fitmatch.sqlManager.getUserFromEmail(email)
        .then(e => {
            const data = e[0];
            if (data.length > 0) {
                response.json(buildInvalidPacket("This email is already in use."));
                return;
            }
            const salt = fitmatch.genUUID();
            bcrypt.hash(password + salt)
                .then(e => {
                    fitmatch.sqlManager.createNewUser(name, lastname ? lastname : null, email, phone ? phone : null, salt, e)
                        .then(e => {
                            fitmatch.getUserFromEmail(email)
                                .then(e => {
                                    const data = e[0][0];
                                    const locationSplit = data.location.split("||");
                                    const user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, locationSplit[0], locationSplit[1], data.isSetup);
                                    fitmatch.userManager.put(user.id, user);
                                    const token = createToken(request.ip, user.id);
                                    response.json(buildTokenPacket(token));
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
        })
        .catch(err => {
            console.log("An error ocurred trying to send a query. Error: " + err);
            response.json(buildInternalErrorPacket("Backend internal error. Check logs if you are an admin."));
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