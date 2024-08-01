import express from 'express';
import { DataTypes } from "sequelize";
import f from "./../api/Fitmatch.js";
import { tokenRequired } from '../api/utils/Validate.js';
import { buildInternalErrorPacket, buildSendDataPacket } from '../api/packets/PacketBuilder.js';

const router = express.Router();

// GET lista de todos los JoinedActivitiess
// vinculamos la ruta /api/JoinedActivitiess a la función declarada
// si todo ok devolveremos un objeto tipo:
//     {ok: true, data: [lista_de_objetos_JoinedActivities...]}
// si se produce un error:
//     {ok: false, error: mensaje_de_error}

router.get('/', tokenRequired, function (req, res, next) {
    const id = req.token.id;
    f.getSqlManager().getJoinedActivities(id)
    .then(e => {
        const data = e[0];
        data.filter(item => {
            const date = new Date(item.expires.replace(" ", "T"));
            return Date.now <= date.getTime();
        })
        data.sort((a, b) => {
            const date = new Date(a.expires.replace(" ", "T"));
            const date2 = new Date(b.expires.replace(" ", "T"));
            return date.getTime() - date2.getTime();
        });
        res.json(buildSendDataPacket(data));
    })
    .catch(err => {
        console.log(err);
        res.json(buildInternalErrorPacket("Backend internal error."));
    })
});

// POST, creació d'un nou JoinedActivities
router.post('/join',tokenRequired, function (req, res, next) {
    const id = parseInt(req.token.id);
    console.log(req.body)
    JoinedActivities.create(req.body)
        .then((item) => item.save())
        .then((item) => res.json({ ok: true, data: item }))
        .catch((error) => res.json({ ok: false, error }))

});


// put modificació d'un JoinedActivities
router.put('/edit/:id', function (req, res, next) {
    JoinedActivities.findOne({ where: { id: req.params.id } })
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



// DELETE elimina l'JoinedActivities id
router.delete('/:id', function (req, res, next) {

    JoinedActivities.destroy({ where: { id: req.params.id } })
        .then((data) => res.json({ ok: true, data }))
        .catch((error) => res.json({ ok: false, error }))

});


// GET JoinedActivities that user not joined
router.get('/notjoined/:userId'), function (req, res, next) {
    JoinedActivities.findAll({where: { userId: req.params.userId }})
    .then((data) => res.json({ ok: true, data }))
    .catch((error) => res.json({ ok: false, error }))
}


export default router;