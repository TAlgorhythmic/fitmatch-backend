import jwt from "jsonwebtoken";
import fitmatch from "./../Fitmatch.js";
import { buildNoPermissionPacket, buildInvalidPacket, buildInternalErrorPacket } from "../packets/PacketBuilder.js";

const numberRegex = /\d/;

// Validación de email
export function isValidEmail(email) {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@[a-z]+\.[a-z]+$/;
    return gmailRegex.test(email);
}

// Validación de contraseña: caracter especial, número y mayúscula
export function isValidPassword(password) {
    const specialCharRegex = /[!@#$%^&*(),.?_=/\\":{}|<>]/;
    const uppercaseRegex = /[A-Z]/;
    return specialCharRegex.test(password) && numberRegex.test(password) && uppercaseRegex.test(password);
}

// Validación de si el texto proporcionado tiene algún número
export function hasNumber(input) {
    return numberRegex.test(input);
}

// Middleware for register endpoint
export function validateRegisterCredentials(req, res, next) {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body)
    if (!name) {
        console.log(name);
        res.json(buildInvalidPacket("A name must be specified."));
        return;
    }
    if (!isValidEmail(email)) {
        res.json(buildInvalidPacket("The email is invalid."));
        return;
    }
    if (!isValidPassword(password)) {
        res.json("The password must include: numbers, special characters, uppercase and lowercase charachters.");
        return;
    }
    next();
}

// Middleware
export function tokenRequired(req, res, next) {
    next();
    return
    let token = req.headers.Authorization || "";

    if (!token) {
        res.json(buildNoPermissionPacket("A token is required."));
        return;
    }
    const split = token.split(" ");
    token = split[split.length - 1];

    jwt.verify(token, fitmatch.getConfig().tokenSecretKey, (err, decoded) => {
        if (err) {
            res.json(buildInternalErrorPacket("Internal error when trying to verify token."));
        } else {
            const expiredAt = decoded.expiredAt;
            if (expiredAt > new Date().getTime()) {
                next();
            } else {
                res.json(buildNoPermissionPacket("This token has expired!"))
            }
        }
    })
}