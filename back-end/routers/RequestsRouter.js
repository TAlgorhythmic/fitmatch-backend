import express from 'express';
import { DataTypes } from "sequelize";
import fitmatch from "../api/Fitmatch.js";
import { tokenRequired } from "../api/utils/Validate.js";
import { buildInternalErrorPacket, buildInvalidPacket, buildSendDataPacket, buildSimpleOkPacket } from '../api/packets/PacketBuilder.js';
import User from '../api/User.js';
import ConnectSession, { sessions } from '../api/utils/ConnectSession.js';
import { sanitizeDataReceivedForArrayOfObjects, sanitizeDataReceivedForSingleObject } from '../api/utils/Sanitizers.js';

const sequelize = fitmatch.getSql();
const sqlManager = fitmatch.getSqlManager();

//DEFINICION DEL MODELO
const Pending = sequelize.define(
    'Pending',
    {
        sender_id: DataTypes.STRING,
        receiver_id: DataTypes.STRING
    },
    { tableName: 'pending', timestamps: false }
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

// GET lista de todos los Pendings
// vinculamos la ruta /api/Pendings a la función declarada
// si todo ok devolveremos un objeto tipo:
//     {ok: true, data: [lista_de_objetos_Pending...]}
// si se produce un error:
//     {ok: false, error: mensaje_de_error}

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

// ACCEPT SWIPE
router.post('/send/:other_id', tokenRequired, function (req, res, next) {
    const id = req.token.id;
    const other_id = req.params.other_id;

    if (id === other_id) {
        res.json(buildInvalidPacket("You cant add yourself."))
    }

    fitmatch.sqlManager.getRejectionByPair(id, other_id).then(e => {
        console.log("Rejections" + e);
        const data = sanitizeDataReceivedForSingleObject(e);
        if (data) {
            res.json(buildInvalidPacket("This user has already rejected you."));
            return;
        }
        fitmatch.sqlManager.getFriendByPair(id, other_id)
            .then(e => {
                console.log("Friends: " + e);
                const data = sanitizeDataReceivedForSingleObject(e);
                if (data) {
                    res.json(buildInvalidPacket("This user is already your friend."));
                    return;
                }
                fitmatch.getSqlManager().sendConnectionRequest(id, other_id)
                    .then(e => {
                        res.json(buildSimpleOkPacket());
                    })
                    .catch(err => {
                        console.log(err);
                        res.json(buildInternalErrorPacket("Backend internal error. Check logs.12"));
                    })
            })
    })
        .catch(err => {
            console.log(err);
            res.json(buildInternalErrorPacket("Backend internal error. Check logs.21"));
        })
});

// ACEPT SOLICITUD notifications

router.post('/accept/:other_id', tokenRequired, function (req, res, next) {
    const id = req.token.id;
    const other_id = req.params.other_id;

    fitmatch.getSqlManager().getReceiverPendingsFromId(id)
        .then(e => {
            const data = sanitizeDataReceivedForArrayOfObjects(e, "sender_id");
            if (data.find(item => item.receiver_id === id)) {
                fitmatch.sqlManager.putFriends(id, other_id)
                    .then(e => {
                        Pending.destroy({ where: { receiver_id: id, sender_id: other_id } })
                            .then((data) => res.json({ ok: true }))
                            .catch((error) => res.json({ ok: false, error }))
                    })
                    .catch(err => {
                        console.log(err);
                        res.json(buildInternalErrorPacket("ERROR DELETING PENDING"));
                    })
            } else {
                res.json(buildInvalidPacket("This user didn't recived any connection request."));
            }
        })
        .catch(err => {
            console.log(err);
            res.json(buildInternalErrorPacket("Backend internal error. Check logs."));
        })
});

// GET de un solo Pending
router.get('/pendings/:id', tokenRequired, function (req, res, next) {
    Pending.findOne({ where: { id: req.params.id } })
        .then(Pending => res.json({
            ok: true,
            data: Pending
        }))
        .catch(error => res.json({
            ok: false,
            error: error
        }))
});

// GET de Pendings de un usuario
router.get('/pendings', tokenRequired, function (req, res, next) {
    const list_of_users = [];
    let i = 0;
    function recursive(array) {
        if (i >= array.length) {
            res.json(buildSendDataPacket(list_of_users));
            return;
        }
        const pendingId = array[i].pendingId;


        fitmatch.sqlManager.getUserFromId(pendingId)
            .then(e => {
                const data = sanitizeDataReceivedForSingleObject(e);
                const user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, data.city, data.latitude, data.longitude, data.isSetup, data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday, data.sunday, data.timetable1, data.timetable2, data.country);
                list_of_users.push(user);
                nextIt(array);
            })
    }
    function nextIt(array) {
        i++;
        recursive(array)
    }
    sqlManager.getPendingsFromReceiver(req.token.id)
        .then(response => {
            console.log(response);
            const data = sanitizeDataReceivedForArrayOfObjects(response, "pendingId");
            console.log(data);
            recursive(data);
        })
        .catch(error => {
            console.log(error);
            res.json(buildInternalErrorPacket("Backend internal error. Check logs."));
        });
});


// POST, creació d'un nou Pending
router.post('/create', tokenRequired, function (req, res, next) {
    Pending.create(req.body)
        .then((item) => item.save())
        .then((item) => res.json({ ok: true, data: item }))
        .catch((error) => res.json({ ok: false, error }))
});

// Likely doesn't work.
// put modificació d'un Pending
router.put('/edit', tokenRequired, function (req, res, next) {
    Pending.findOne({ where: { id: req.token.id } })
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

// REJECT IN THE SWIPE
router.post("/reject/:other_id", tokenRequired, (req, res, next) => {

    const id = req.token.id;
    const other_id = req.params.other_id;

    fitmatch.sqlManager.getRejectionByPair(id, other_id).then(e => {
        console.log("Rejections" + e);
        const data = sanitizeDataReceivedForSingleObject(e);
        if (data) {
            res.json(buildInvalidPacket("This user has already rejected you."));
            return;
        }
        if (!fitmatch.userManager.containsKey(id)) {
            const user = fitmatch.userManager.get(id).user;
            if (!sessions.has(id)) {
                sessions.set(id, new ConnectSession(user));
            }
            fitmatch.sqlManager.putRejection(id, other_id)
            .then(e => {
                res.json(buildSimpleOkPacket());
            })
            .catch(err => {
                console.log(err);
                res.json(buildInternalErrorPacket("Backend internal error. Check logs."));
            })
        } else {
            fitmatch.sqlManager.getUserFromId(id)
            .then(e => {
                const data = sanitizeDataReceivedForSingleObject(e);
                const user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, data.city, data.latitude, data.longitude, data.isSetup, data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday, data.sunday, data.timetable1, data.timetable2, data.country);
                fitmatch.userManager.put(id, user);
                if (!sessions.has(id)) {
                    sessions.set(id, new ConnectSession(user));
                }
                fitmatch.sqlManager.putRejection(id, other_id)
                .then(e => {
                    res.json(buildSimpleOkPacket());
                })
                .catch(err => {
                    console.log(err);
                    res.json(buildInternalErrorPacket("Backend internal error. Check logs."));
                })
            })
            .catch(err => {
                console.log(err);
                res.json(buildInternalErrorPacket("Backend internal error. Check logs."));
            })
        }
    })
        .catch(err => {
            console.log(err);
            res.json(buildInternalErrorPacket("Backend internal error. Check logs.21"));
        })
})

// REJECT IN THE FRIEND REQUEST
router.post("/rejectFriendRequest/:other_id", tokenRequired, (req, res, next) => {
    Pending.destroy({ where: { receiver_id: req.token.id, sender_id: req.params.other_id } })
        .then((data) => res.json({ ok: true }))
        .catch((error) => res.json({ ok: false, error }))
})

export default router;