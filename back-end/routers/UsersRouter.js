import fitmatch from "./../api/Fitmatch.js";
import { isValidTimetable, tokenRequired } from "./../api/utils/Validate.js";
import express from "express";
import { DataTypes } from "sequelize";
import multer from "multer";
import path from "path";
import slugify from "slugify";
import fs from "fs";
import { buildInternalErrorPacket, buildInvalidPacket, buildSimpleOkPacket, buildSendDataPacket } from "../api/packets/PacketBuilder.js";
import ConnectSession, { sessions } from "../api/utils/ConnectSession.js";
import User from "../api/User.js";
import { sanitizeDataReceivedForSingleObject } from "../api/utils/Sanitizers.js";

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

// GET lista de todos los Userss
// vinculamos la ruta /api/Userss a la función declarada
// si todo ok devolveremos un objeto tipo:
//     {ok: true, data: [lista_de_objetos_Users...]}
// si se produce un error:
//     {ok: false, error: mensaje_de_error}

router.get('/', tokenRequired, function (req, res, next) {

    Users.findAll()
        .then(Userss => {
            res.json(Userss)
        })
        .catch(error => {
            console.log(error);
            res.json(buildInternalErrorPacket("Backend internal error. Check logs if you're an admin."));
        })

});

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
            const user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, data.city, data.latitude, data.longitude, data.isSetup, data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday, data.sunday, data.timetable1, data.timetable2);
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
        return b.matchPercent - a.matchPercent;
    });

    // Get the amount of items the 25% actually is.
    const amount = Math.floor((array.length * 25) / 100);

    const likelyMatch = [];

    // Push likely matches.
    for (let i = 0; i < amount; i++) {
        likelyMatch.push(array.pop());
    }

    const feed = [];
    // Sketchy sort.

    if (!array.length && !likelyMatch.length) return feed;

    feed.push(likelyMatch.pop());
    let i = 0;
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



// GET compatible users
router.get('/connect', tokenRequired, function (req, res, next) {
    const token = req.token;

    if (fitmatch.userManager.containsKey(token.id)) {
        const user = fitmatch.userManager.get(token.id);

        if (!sessions.has(token.id)) {
            sessions.set(token.id, new ConnectSession(user));
        }

        sessions.get(token.id).sendMore(res);
    } else {
        fitmatch.getSqlManager().getUserFromId(token.id)
            .then(e => {
                const data = sanitizeDataReceivedForSingleObject(e);
                const user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, data.city, data.latitude, data.longitude, data.isSetup, data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday, data.sunday, data.timetable1, data.timetable2);
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

/**
 * Data expected:
 * token
 * body: {
 *      preferencesArray,
 *      description,
 *      img, (optional)
 *      proficiency, 
 *      city,
 *      latitude,
 *      longitude
 * }
 */
router.post("/setup", tokenRequired, (req, res, next) => {
    const id = req.token.id;
    console.log(req.body.preferences);
    const preferences = req.body.preferences.length ? req.body.preferences : null;
    
    if (!preferences) {
        
        res.json(buildInvalidPacket("Preferences is empty."));
        return;
    }
    const description = req.body.description ? req.body.description : null;
    const img = req.body.img ? req.body.img : "img1.jpg";
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
        user.setIsSetup(true);
        user.setTrainingPreferences(preferences);
        user.setDescription(description);
        user.setImg(img);
        user.setProficiency(proficiency);
        user.setMonday(monday);
        user.setTuesday(tuesday);
        user.setWednesday(wednesday);
        user.setThursday(thursday);
        user.setFriday(friday);
        user.setSaturday(saturday);
        user.setSunday(sunday);
        user.setTimetable1(timetable1);
        user.setTimetable2(timetable2);
        res.json(buildSimpleOkPacket());
    } else {
        fitmatch.getSqlManager().getUserFromId(id)
        .then(e => {
            const data = sanitizeDataReceivedForSingleObject(e);
            const user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, data.city, data.latitude, data.longitude, data.isSetup, data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday, data.sunday, data.timetable1, data.timetable2);
            fitmatch.userManager.put(user.id, user);
            user.setIsSetup(true);
            user.setTrainingPreferences(preferences);
            user.setDescription(description);
            user.setImg(img);
            user.setProficiency(proficiency);
            user.setMonday(monday);
            user.setTuesday(tuesday);
            user.setWednesday(wednesday);
            user.setThursday(thursday);
            user.setFriday(friday);
            user.setSaturday(saturday);
            user.setSunday(sunday);
            user.setTimetable1(timetable1);
            user.setTimetable2(timetable2);
            res.json(buildSimpleOkPacket());
        });
    }
})

// put modificació d'un Users
router.post('/edit', tokenRequired, function (req, res, next) {
    console.log(req.body);
    if (fitmatch.userManager.containsKey(req.token.id)) {
        res.json(buildSendDataPacket(fitmatch.userManager.get(req.token.id).user));
        return;
    }
    Users.findOne({ where: { id: req.token.id } })
        .then((al) =>
            al.update(req.body)
        )
        .then((ret) => res.json(buildSimpleOkPacket()))
        .catch(error => {
            console.log(error);
            res.json(buildInternalErrorPacket("Backend internal error."));
        });

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

router.get("/profile", tokenRequired, (req, res, next) => {
    const id = req.token.id;
    if (fitmatch.getUserManager().containsKey(id)) {
        console.log(fitmatch.getUserManager().get(id).user);
        res.json(buildSendDataPacket(fitmatch.getUserManager().get(id).user));
    } else {
        fitmatch.getSqlManager().getUserFromId(id)
            .then(e => {
                const data = sanitizeDataReceivedForSingleObject(e);
                const user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, data.city, data.latitude, data.longitude, data.isSetup, data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday, data.sunday, data.timetable1, data.timetable2);
                fitmatch.getUserManager().put(user.id, user);
                console.log(user);
                res.json(buildSendDataPacket(user));
            })
            .catch(err => {
                console.log(err);
                res.json("Backend internal error. Check logs.");
            })
    }
})
export default router;