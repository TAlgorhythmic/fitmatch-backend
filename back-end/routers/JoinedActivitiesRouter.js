import express from 'express';
import f from "./../api/Fitmatch.js";
import { tokenRequired } from '../api/utils/Validate.js';
import { buildInternalErrorPacket, buildSendDataPacket } from '../api/packets/PacketBuilder.js';

const router = express.Router();

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
router.post('/join/:id',tokenRequired, function (req, res, next) {
    const id = parseInt(req.token.id);
    
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