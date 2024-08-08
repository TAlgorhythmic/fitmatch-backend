import express from 'express';
import { DataTypes } from "sequelize";
import fitmatch from "../api/Fitmatch.js";
import { tokenRequired } from "../api/utils/Validate.js";
import { buildInternalErrorPacket, buildInvalidPacket, buildSendDataPacket, buildSimpleOkPacket } from '../api/packets/PacketBuilder.js';
import User from '../api/User.js';
import ConnectSession, { sessions } from '../api/utils/ConnectSession.js';

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

    Friends.findAll({ where: { userId1: req.token.id } })
        .then(Userss => {
            res.json(Userss)
        })
        .catch(error => res.json({
            ok: false,
            error: error
        }))

});

// ACCEPT SWIPE
router.post('/send/:other_id', tokenRequired, function (req, res, next) {
    const id = req.token.id;
    const other_id = req.params.other_id;

    // TODO check for rejects

    fitmatch.getSqlManager().sendConnectionRequest(id, other_id)
    .then(e => {
        res.json(buildSimpleOkPacket())
    })
    .catch(err => {
        console.log(err);
        res.json(buildInternalErrorPacket("Backend internal error. Check logs."));
    })
});

// ACEPT SOLICITUD notifications

router.post('/accept/:other_id', tokenRequired, function (req, res, next) {
    const id = req.token.id;
    const other_id = req.params.other_id;

    fitmatch.getSqlManager().getReceiverPendingsFromId(id)
        .then(e => {
            const data = e;
            if (data.find(item => item.receiver_id === id)) {
                fitmatch.sqlManager.putFriends(id, other_id)
                    .then(e => {
                        Pending.destroy({ where: { receiver_id: id, sender_id: other_id} })
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
    sqlManager.getAllPendings(req.token.id)
        .then(response => {
            response.forEach(element => {
                list_of_users.push({
                    id: element.id,
                    name: element.name,
                    lastName: element.lastname,
                    img: element.img,
                    description: element.description
                });
            });
            res.json(buildSendDataPacket(list_of_users));
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

    if (!sessions.has(id)) {
        sessions.set(id, new ConnectSession(id));
    }

    const session = sessions.get(id);
    session.rejects.push(other_id);
    res.json(buildSimpleOkPacket());

    fitmatch.sqlManager.putRejection(id, other_id)
        .then(e => {
            res.json(buildSimpleOkPacket());
        })
        .catch(err => {
            console.log(err);
            res.json(buildInternalErrorPacket("Backend internal error. Check logs."));
        })
})

// REJECT IN THE FRIEND REQUEST
router.post("/rejectFriendRequest/:other_id", tokenRequired, (req, res, next) => {
    Pending.destroy({ where: { receiver_id: req.token.id, sender_id: req.params.other_id } })
        .then((data) => res.json({ ok: true }))
        .catch((error) => res.json({ ok: false, error }))
})

export default router;