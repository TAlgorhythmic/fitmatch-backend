import fitmatch from "./../api/Fitmatch.js";
import express from 'express';
import { DataTypes } from "sequelize";
import { tokenRequired } from "./../api/utils/Validate.js";
import { buildInternalErrorPacket, buildInvalidPacket, buildSendDataPacket, buildSimpleOkPacket } from "../api/packets/PacketBuilder.js";
import User from "../api/User.js";

const sequelize = fitmatch.getSql();
const sqlManager = fitmatch.getSqlManager();

//DEFINICION DEL MODELO
const Activities = sequelize.define(
    'Activities',
    {
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        postDate: DataTypes.DATE,
        expires: DataTypes.DATE,
        userId: DataTypes.INTEGER,
        tableVersion: DataTypes.INTEGER
    },
    { tableName: 'activities', timestamps: false }
);

const Friends = sequelize.define(
    'Friends',
    {
        userId1: DataTypes.INTEGER,
        userId2: DataTypes.INTEGER,
    },
    { tableName: 'friends', timestamps: false }
);

const router = express.Router();

// GET lista de todos los Activitiess
// vinculamos la ruta /api/Activitiess a la función declarada
// si todo ok devolveremos un objeto tipo:
//     {ok: true, data: [lista_de_objetos_Activities...]}
// si se produce un error:
//     {ok: false, error: mensaje_de_error}

router.get('/', tokenRequired, async function (req, res, next) {
    sqlManager.getAllActivities()
        .then(activities => {
            const data = activities[0];
            const filtered = sqlManager.filterActivities(data);
            let i = 0;
            function recursive() {
                if (!filtered[i]) {
                    res.json(buildSendDataPacket(filtered));
                    return;
                }
                fitmatch.getSqlManager().getUserFromId(filtered[i].userId)
                .then(e => {
                    const data = e[0];
                    const user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, data.city, data.latitude, data.longitude, data.isSetup, data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday, data.sunday, data.timetable1, data.timetable2);
                    filtered[i].user = user;
                    i++;
                    recursive();
                })
            }
            recursive();
        })
        .catch(error => {
            console.log(error);
            res.json(
            buildInvalidPacket("Backend internal error.")
        )
    });
});

router.get("/feed", tokenRequired, (req, res, next) => {
    sqlManager.getActivitiesFeed(req.token.id, res);
});

// POST, creació d'un nou Activities
router.post('/create', tokenRequired, function (req, res, next) {
    Activities.create(req.body)
        .then((item) => item.save())
        .then((item) => res.json({ ok: true, data: item }))
        .catch((error) => res.json({ ok: false, error }))

});


/**
 * expects: 
 * token, activity id as params
 * {
 *      title,
 *      description,
 *      expires,
 * }
 */
router.post('/edit/:id', tokenRequired, function (req, res, next) {
    const id = req.params.id;
    if (!id) {
        res.json(e => buildInvalidPacket("What is this id...?"));
        return;
    }
    const title = req.body.title;
    const description = req.body.description;
    const expires = req.body.expires;
    
    const prom = fitmatch.sqlManager.updateActivity(id, title, description, expires, res);
    
    if (prom) {
        prom.then(e => {
            res.json(buildSimpleOkPacket());
        })
        .catch(err => {
            console.log(err);
            res.json(buildInternalErrorPacket("Backend internal error. Check logs."));
        });
    }
});

router.get("/get/:id", tokenRequired, (req, res, next) => {
    const activityId = req.params.id;

    fitmatch.sqlManager.getActivityFromId(activityId)
    .then(e => {
        const data = e[0];
        res.json(buildSendDataPacket(data));
    })
})

// DELETE elimina l'Activities id
// TODO
router.delete('/:id', tokenRequired, function (req, res, next) {

    Activities.destroy({ where: { id: req.params.id } })
        .then((data) => res.json({ ok: true, data }))
        .catch((error) => res.json({ ok: false, error }))

});

export default router;