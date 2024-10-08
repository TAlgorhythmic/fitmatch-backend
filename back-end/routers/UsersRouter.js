import fitmatch from "./../api/Fitmatch.js";
import { isValidTimetable, tokenRequired, tokenRequiredUnverified } from "./../api/utils/Validate.js";
import express from "express";
import { DataTypes } from "sequelize";
import multer from "multer";
import path from "path";
import slugify from "slugify";
import fs from "fs";
import { buildInternalErrorPacket, buildInvalidPacket, buildSimpleOkPacket, buildSendDataPacket } from "../api/packets/PacketBuilder.js";
import ConnectSession, { sessions } from "../api/utils/ConnectSession.js";
import User from "../api/User.js";
import { sanitizeDataReceivedForArrayOfObjects, sanitizeDataReceivedForSingleObject } from "../api/utils/Sanitizers.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const slug = slugify(path.basename(file.originalname, path.extname(file.originalname)), { lower: true, strict: true });
        cb(null, `${Date.now()}_${slug}${path.extname(file.originalname)}`);
    }
});

const router = express.Router();
const sequelize = fitmatch.getSql();
const upload = multer({ storage: storage });

//DEFINICION DEL MODELOuser
const Users = sequelize.define(
    'Users',
    {
        name: DataTypes.STRING,
        lastname: DataTypes.INTEGER,
        email: DataTypes.STRING,
        phone: DataTypes.INTEGER,
        img: DataTypes.STRING,
        description: DataTypes.STRING,
        proficiency: DataTypes.STRING,
        trainingPreferences: DataTypes.STRING,
        city: DataTypes.STRING,
        latitude: DataTypes.STRING,
        longitude: DataTypes.STRING,
        isSetup: DataTypes.BOOLEAN,
        tableVersion: DataTypes.INTEGER
    },
    { tableName: 'users', timestamps: false }
);

router.post("/upload/image", tokenRequired, upload.single("img"), (req, res, next) => {
    if (!req.file) {
        res.json(buildInvalidPacket("Image is empty."));
        return;
    }
    const id = req.token.id;
    if (fitmatch.userManager.containsKey(id)) {
        const user = fitmatch.userManager.get(id).user;
        if (user.img && user.img !== "img1.jpg") {
            if (fs.existsSync("./uploads/" + user.img)) fs.rmSync("./uploads/" + user.img);
        }
        user.setImg(req.file.filename);
    } else {
        fitmatch.sqlManager.getUserFromId(id)
            .then(e => {
                const data = sanitizeDataReceivedForSingleObject(e);
                const user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, data.city, data.latitude, data.longitude, data.isSetup, data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday, data.sunday, data.timetable1, data.timetable2, data.country, data.isVerified);
                if (user.img && user.img !== "img1.jpg") {
                    if (fs.existsSync("./uploads/" + user.img)) fs.rmSync("./uploads/" + user.img);
                }
                user.setImg(req.file.filename);
                fitmatch.userManager.put(id, user);
            })
    }
    res.json(buildSimpleOkPacket());
});

// GET de un solo Users
/*router.get('/:id', tokenRequired, function (req, res, next) {
    Users.findOne({ where: { id: req.params.id } })
        .then(Users => res.json({
            ok: true,
            data: Users
        }))
        .catch(error => res.json({
            ok: false,
            error: error
        }))
});*/

export function sketchyOrder(array) {
    
    // inverse sort to extract the 25% of the most likely matches users.
    array.sort((a, b) => {
        return a.matchPercent - b.matchPercent;
    });

    // Get the amount of items the 25% actually is.
    const amount = Math.floor((array.length * 25) / 100);
    
    const likelyMatch = [];

    // Push likely matches.
    for (let i = 0; i < amount; i++) {
        likelyMatch.push(array.pop());
    }

    console.log("Likely match: ");
    console.log(likelyMatch);
    console.log("Leftover match: ");
    console.log(array);

    const feed = [];
    // Sketchy sort.

    if (!array.length && !likelyMatch.length) return feed;

    if (likelyMatch.length) feed.push(likelyMatch.pop());
    let i = 1;
    while (array.length || likelyMatch.length) {
        if (i % 4 === 0 && likelyMatch.length) {
            const pop = likelyMatch.pop();
            feed.push(pop);
        }
        else {
            const pop = array.pop();
            feed.push(pop);
        }
        i++;
    }
    return feed;
}

router.get('/friends', tokenRequired, function (req, res, next) {

    const id = req.token.id;
    const ids = []

    fitmatch.sqlManager.getFriendsById(id)
    .then(e => {
        const data = sanitizeDataReceivedForArrayOfObjects(e, "friendId");
        data.forEach(item => ids.push(item.friendId));
        res.json(buildSendDataPacket(ids));
    })
    .catch(err => {
        console.log(err);
        res.json(buildInternalErrorPacket("Backend internal error. Check logs."));
    })
});

router.delete("/friends/remove/:other_id", tokenRequired, (req, res, next) => {
    const id = req.token.id;
    const other_id = req.params.other_id;
    
    fitmatch.getSqlManager().getFriendByPair(id, other_id)
    .then(e => {
        const data = sanitizeDataReceivedForSingleObject(e);
        if (!data) {
            res.json(buildInvalidPacket("This user is not your friend."));
            return;
        }

        fitmatch.sqlManager.removeFriendEntry(id, other_id)
        .then(e => {
            res.json(buildSimpleOkPacket());
        })
    }).catch(err => {
        console.log(err);
        res.json(buildInternalErrorPacket("Backend internal error. Check logs."))
    })
})

router.get('/connections', tokenRequired, function (req, res, next) {

    const id = req.token.id;
    const users = []

    fitmatch.sqlManager.getFriendsById(id)
    .then(e => {
        const data = sanitizeDataReceivedForArrayOfObjects(e, "friendId");
        let i = 0;
        function recursive() {
            if (!data[i]) {
                res.json(buildSendDataPacket(users));
                return;
            }

            if (fitmatch.userManager.containsKey(data[i].friendId)) {
                const user = fitmatch.userManager.get(data[i].friendId).user;
                users.push(user);
                i++;
                recursive();
            } else {
                fitmatch.sqlManager.getUserFromId(data[i].friendId)
                .then(e => {
                    const data = sanitizeDataReceivedForSingleObject(e);
                    const user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, data.city, data.latitude, data.longitude, data.isSetup, data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday, data.sunday, data.timetable1, data.timetable2, data.country, data.isVerified);
                    users.push(user);
                    i++;
                    recursive();
                })
            }
        }
        recursive();
    })
    .catch(err => {
        console.log(err);
        res.json(buildInternalErrorPacket("Backend internal error. Check logs."));
    })
});

// GET compatible users
router.get('/connect', tokenRequired, function (req, res, next) {
    const token = req.token;

    if (fitmatch.userManager.containsKey(token.id)) {
        const user = fitmatch.userManager.get(token.id).user;

        if (!sessions.has(token.id)) {
            sessions.set(token.id, new ConnectSession(user));
        }

        sessions.get(token.id).sendMore(res);
    } else {
        fitmatch.getSqlManager().getUserFromId(token.id)
            .then(e => {
                const data = sanitizeDataReceivedForSingleObject(e);
                const user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, data.city, data.latitude, data.longitude, data.isSetup, data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday, data.sunday, data.timetable1, data.timetable2, data.country);
                fitmatch.getUserManager().put(user.id, user);

                if (!sessions.has(token.id)) {
                    sessions.set(token.id, new ConnectSession(user));
                }

                sessions.get(token.id).sendMore(res);
            })
            .catch(err => {
                console.log(err);
                res.json(buildInternalErrorPacket("Backend internal error. Check logs."));
            })
    }
});

router.post("/setup", tokenRequired, (req, res, next) => {
    const id = req.token.id;

    const phone = req.body.phone ? req.body.phone : null;
    const preferences = Array.isArray(req.body.preferences) ? (req.body.preferences.length ? req.body.preferences : null) : typeof req.body.preferences === "string" || req.body.preferences instanceof String ? req.body.preferences.split(", ") : null;
    if (preferences.length > 1 && !preferences[0]) preferences.shift();
    
    const lastname = req.body.lastName ? req.body.lastName : null;
    if (!preferences) {
        res.json(buildInvalidPacket("Preferences is empty."));
        return;
    }
    const description = req.body.description ? req.body.description : null;
    const proficiency = req.body.proficiency;
    if (!proficiency) {
        res.json(buildInvalidPacket("You must select your proficiency level!"));
        return;
    }
    const city = req.body.city;
    if (!city) {
        res.json(buildInvalidPacket("City is empty."));
        return;
    }
    const latitude = req.body.latitude;
    if (!latitude) {
        res.json(buildInvalidPacket("You must include a latitude."));
        return;
    }
    const longitude = req.body.longitude;
    if (!longitude) {
        res.json(buildInvalidPacket("You must include a longitude."));
        return;
    }
    const monday = req.body.monday ? true : false;
    const tuesday = req.body.tuesday ? true : false;
    const wednesday = req.body.wednesday ? true : false;
    const thursday = req.body.thursday ? true : false;
    const friday = req.body.friday ? true : false;
    const saturday = req.body.saturday ? true : false;
    const sunday = req.body.sunday ? true : false;
    const timetable1 = req.body.timetable1;
    const timetable2 = req.body.timetable2;

    if (!isValidTimetable(timetable1) || !isValidTimetable(timetable2)) {
        console.log(`${timetable1} - ${timetable2}`);
        res.json(buildInvalidPacket("Timetable is not valid."));
        return;
    }

    if (fitmatch.getUserManager().containsKey(req.token.id)) {
        const user = fitmatch.getUserManager().get(req.token.id).user;
        user.setPhone(phone)
        user.setIsSetup(true);
        user.setTrainingPreferences(preferences);
        user.setLastName(lastname);
        user.setDescription(description);
        user.setProficiency(proficiency);
        user.setMonday(monday);
        user.setCity(city);
        user.setTuesday(tuesday);
        user.setWednesday(wednesday);
        user.setThursday(thursday);
        user.setFriday(friday);
        user.setSaturday(saturday);
        user.setSunday(sunday);
        user.setLatitude(latitude);
        user.setLongitude(longitude);
        user.setTimetable1(timetable1);
        user.setTimetable2(timetable2);
        res.json(buildSimpleOkPacket());
    } else {
        fitmatch.getSqlManager().getUserFromId(id)
            .then(e => {
                const data = sanitizeDataReceivedForSingleObject(e);
                const user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, data.city, data.latitude, data.longitude, data.isSetup, data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday, data.sunday, data.timetable1, data.timetable2, data.country, data.isVerified);
                fitmatch.userManager.put(user.id, user);
                user.setPhone(phone)
                user.setIsSetup(true);
                user.setTrainingPreferences(preferences);
                user.setLastName(lastname);
                user.setDescription(description);
                user.setProficiency(proficiency);
                user.setMonday(monday);
                user.setCity(city);
                user.setTuesday(tuesday);
                user.setWednesday(wednesday);
                user.setThursday(thursday);
                user.setFriday(friday);
                user.setSaturday(saturday);
                user.setSunday(sunday);
                user.setLatitude(latitude);
                user.setLongitude(longitude);
                user.setTimetable1(timetable1);
                user.setTimetable2(timetable2);
                res.json(buildSimpleOkPacket());
            });
    }
})

// put modificació d'un Users
router.post('/edit', tokenRequired, function (req, res, next) {
    const name = req.body.name;
    if (!name) {
        res.json(buildInvalidPacket("The name is empty."));
        return;
    }

    const lastname = req.body.lastname ? req.body.lastname : null;
    const email = req.body.email ? req.body.email : null;
    const description = req.body.description ? req.body.description : null;
    const proficiency = req.body.proficiency && (req.body.proficiency === "Principiante" || req.body.proficiency === "Intermedio" || req.body.proficiency === "Avanzado") ? req.body.proficiency : null;
    if (proficiency === null) {
        console.warn("Warning! proficiency for " + name + " is null when it shouldn't!")
    }
    const trainingPreferences = Array.isArray(req.body.trainingPreferences) ? req.body.trainingPreferences : null;
    const country = req.body.country ? req.body.country : null;
    const city = req.body.city ? req.body.city : null;
    const latitude = req.body.latitude ? req.body.latitude : null;
    const longitude = req.body.longitude ? req.body.longitude : null;
    const monday = req.body.monday ? true : false;
    const tuesday = req.body.tuesday ? true : false;
    const wednesday = req.body.wednesday ? true : false;
    const thursday = req.body.thursday ? true : false;
    const friday = req.body.friday ? true : false;
    const saturday = req.body.saturday ? true : false;
    const sunday = req.body.sunday ? true : false;
    const timetable1 = req.body.timetable1 ? req.body.timetable1 : null;
    const timetable2 = req.body.timetable2 ? req.body.timetable2 : null;

    let user = null;
    if (fitmatch.userManager.containsKey(req.token.id)) {
        user = fitmatch.userManager.get(req.token.id).user;
    }

    const update = () => {
        user.setName(name);
        user.setLastName(lastname);
        user.setEmail(email);
        user.setDescription(description);
        user.setTrainingPreferences(trainingPreferences);
        user.setCountry(country);
        user.setLocation(city, latitude, longitude);
        user.setMonday(monday);
        user.setTuesday(tuesday);
        user.setWednesday(wednesday);
        user.setThursday(thursday);
        user.setFriday(friday);
        user.setSaturday(saturday);
        user.setSunday(sunday);
        user.setTimetable1(timetable1);
        user.setTimetable2(timetable2);
    }

    if (user !== null) {
        update();
    } else {
        fitmatch.getSqlManager().getUserFromId(req.token.id)
            .then(e => {
                const data = sanitizeDataReceivedForSingleObject(e);
                user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, data.city, data.latitude, data.longitude, data.isSetup, data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday, data.sunday, data.timetable1, data.timetable2, data.country, data.isVerified);
                fitmatch.userManager.put(user.id, user);
                update();
                res.json(buildSimpleOkPacket());
            })
            .catch(err => {
                console.log(err);
                res.json(buildInternalErrorPacket("Backend internal error. Check logs."));
            })
    }
});

// DELETE elimina l'Users id
router.delete('/removeacc', tokenRequired, function (req, res, next) {
    const password = req.body.password;

    Users.destroy({ where: { id: req.params.id } })
        .then((data) => res.json({ ok: true, data }))
        .catch((error) => res.json({ ok: false, error }))
    // TODO
});

// GET Users that user not joined
router.get('/notjoined/:userId'), function (req, res, next) {
    Users.findAll({ where: { userId: req.params.userId } })
        .then((data) => res.json({ ok: true, data }))
        .catch((error) => res.json({ ok: false, error }))
}


// Modificacio de contraseña
router.put('/changepasswd', tokenRequired, function (req, res, next) {
    Users.findOne({ where: { id: req.token.id } })
        .then(user => {
            if (!user) {
                return res.send({ message: 'User not found' });
            }
            return user.update({ password: req.body.password });
        })
        .then(updatedUser => {
            res.send({ message: 'Password updated successfully' });
        })
        .catch(error => {
            next(error); // Pasa el error al manejador de errores de Express
        });
});

router.get("/profile", tokenRequiredUnverified, (req, res, next) => {
    const id = req.token.id;
    if (fitmatch.getUserManager().containsKey(id)) {
        res.json(buildSendDataPacket(fitmatch.getUserManager().get(id).user));
    } else {
        fitmatch.getSqlManager().getUserFromId(id)
            .then(e => {
                const data = sanitizeDataReceivedForSingleObject(e);
                const user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, data.city, data.latitude, data.longitude, data.isSetup, data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday, data.sunday, data.timetable1, data.timetable2, data.country, data.isVerified);
                fitmatch.getUserManager().put(user.id, user);
                res.json(buildSendDataPacket(user));
            })
            .catch(err => {
                console.log(err);
                res.json("Backend internal error. Check logs.");
            })
    }
})

router.get("/profile/:id", tokenRequired, (req, res, next) => {
    const id = req.token.id;
    const other_id = req.params.id;

    fitmatch.sqlManager.getFriendByPair(id, other_id)
    .then(e => {
        const friendData = sanitizeDataReceivedForSingleObject(e);
        if (!friendData) {
            res.json(buildInvalidPacket("You don't have permission to see this profile."));
            return;
        }
        if (fitmatch.getUserManager().containsKey(other_id)) {
            res.json(buildSendDataPacket(fitmatch.getUserManager().get(other_id).user));
        } else {
            fitmatch.getSqlManager().getUserFromId(other_id)
                .then(e => {
                    const data = sanitizeDataReceivedForSingleObject(e);
                    const user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, data.city, data.latitude, data.longitude, data.isSetup, data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday, data.sunday, data.timetable1, data.timetable2, data.country, data.isVerified);
                    fitmatch.getUserManager().put(user.id, user);
                    res.json(buildSendDataPacket(user));
                })
                .catch(err => {
                    console.log(err);
                    res.json("Backend internal error. Check logs.");
                })
        }
    })

    
})
export default router;