import fitmatch from "./../api/Fitmatch.js";
import { tokenRequired } from "./../api/utils/Validate.js";
import express from "express";
import { DataTypes } from "sequelize";
import multer from "multer";
import path from "path";
import slugify from "slugify";
import { buildInternalErrorPacket, buildInvalidPacket, buildSimpleOkPacket } from "../api/packets/PacketBuilder.js";
import ConnectSession, { sessions } from "../api/utils/ConnectSession.js";
import User from "../api/User.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./../uploads/");
    },
    filename: (req, file, cb) => {
        const slug = slugify(path.basename(file.originalname, path.extname(file.originalname)), { lower: true, strict: true });
        cb(null, `${Date.now}_${slug}${path.extname(file.originalname)}`);
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
            console.log(Userss);
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
    res.json(buildSimpleOkPacket());
});

// GET de un solo Users
router.get('/:id', function (req, res, next) {
    Users.findOne({ where: { id: req.params.id } })
        .then(Users => res.json({
            ok: true,
            data: Users
        }))
        .catch(error => res.json({
            ok: false,
            error: error
        }))
});

export function sketchyOrder(array) {
    // Sort to extract the 25% of the most likely matches users.
    array.sort((a, b) => {
        return b.matchPercent - a.matchPercent;
    })

    // Get the amount of items the 25% is.
    const amount = Math.floor((array.length * 25) / 100);
    const likelyMatch = [];

    // Push likely matches.
    for (let i = 0; i < amount; i++) {
        likelyMatch.push(array.pop());
    }

    const feed = [];
    // Sketchy sort.
    feed.push(likelyMatch.pop());
    let i = 0;
    while (array.length || likelyMatch.length) {
        if (i % 4 === 0 && likelyMatch.length) feed.push(likelyMatch.pop());
        else feed.push(array.pop());
    }
    return feed;
}



// GET compatible users
router.get('/connect', tokenRequired, function (req, res, next) {
    const token = req.token;

    if (!sessions.has(token.id)) {
        sessions.set(token.id, new ConnectSession())
    }
    
    sessions.get(token.id).sendMore(res);
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
    const preferences = req.body.preferences.length ? req.body.preferences : null;
    if (!preferences) {
        res.json(buildInvalidPacket("Preferences is empty."));
        return;
    }
    const description = req.body.description ? req.body.description : null;
    const img = req.body.img ? req.body.img : null;
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
    if (fitmatch.getUserManager().containsKey(req.token.id)) {
        const user = fitmatch.getUserManager().get(req.token.id).user;
        user.setIsSetup(true);
        user.setTrainingPreferences(preferences);
        user.setDescription(description);
        user.setImg(img);
        user.setProficiency(proficiency);
    }
    fitmatch.getSqlManager().getUserFromId(id)
    .then(e => {
        const data = e[0][0];
        const user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, data.city, data.latitude, data.longitude, data.isSetup);
        fitmatch.userManager.put(user.id, user);
        user.setIsSetup(true);
        user.setTrainingPreferences(preferences);
        user.setDescription(description);
        user.setImg(img);
        user.setProficiency(proficiency);
    });
})

// put modificació d'un Users
router.put('/edit', tokenRequired, function (req, res, next) {
    Users.findOne({ where: { id: req.token.id } })
        .then((al) =>
            al.update(req.body)
        )
        .then((ret) => res.json({
            ok: true,
            msg: "Record updated",
            data: ret
        }))
        .catch(error => res.json({
            ok: false,
            error: error
        }));

});



// DELETE elimina l'Users id
router.delete('/:id', function (req, res, next) {

    Users.destroy({ where: { id: req.params.id } })
        .then((data) => res.json({ ok: true, data }))
        .catch((error) => res.json({ ok: false, error }))

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

export default router;