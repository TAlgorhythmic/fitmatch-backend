import express from 'express';
import { DataTypes } from "sequelize";
import fitmatch from "../api/Fitmatch.js";
import { tokenRequired } from "../api/utils/Validate.js";

const sequelize = fitmatch.getSql();
const sqlManager = fitmatch.getSqlManager();

//DEFINICION DEL MODELO
const Pending = sequelize.define(
    'Pending',
    {
        sender_id: DataTypes.INTEGER,
        reciver_id: DataTypes.INTEGER
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
            console.log(Userss);
        })
        .catch(error => res.json({
            ok: false,
            error: error
        }))

});


// ACEPT SOLICITUD

router.post('/accept/:other_id', tokenRequired, function (req, res, next) {
    Friends.create(req.params.other_id, req.token.id)
        .then((item) => item.save())
        .then((item) => {
            Pending.destroy({ where: { receiver_id: req.token.id, sender_id: req.params.other_id } })
                .then((data) => {
                    res.json({ ok: true, data: item });
                })
                .catch((error) => {
                    res.json({ ok: false, error });
                });
        })
        .catch((error) => {
            res.json({ ok: false, error });
        });
});

// GET de un solo Pending
router.get('/:id', tokenRequired, function (req, res, next) {
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



// POST, creació d'un nou Pending
router.post('/create', tokenRequired, function (req, res, next) {
    Pending.create(req.body)
        .then((item) => item.save())
        .then((item) => res.json({ ok: true, data: item }))
        .catch((error) => res.json({ ok: false, error }))
});

// POST, creació d'un nou Rejected peticion


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



// DELETE elimina l'Pending id
router.delete('/reject/:other_id', tokenRequired, function (req, res, next) {

    Pending.destroy({ where: { receiver_id: req.params.other_id, sender_id: req.token.id } })
        .then((data) => res.json({ ok: true, data }))
        .catch((error) => res.json({ ok: false, error }))

});

export default router;