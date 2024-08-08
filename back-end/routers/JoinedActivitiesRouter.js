import express from 'express';
import f from "./../api/Fitmatch.js";
import { tokenRequired } from '../api/utils/Validate.js';
import { buildInternalErrorPacket, buildSendDataPacket } from '../api/packets/PacketBuilder.js';

const router = express.Router();

router.get('/', tokenRequired, function (req, res, next) {
    const id = req.token.id;
    f.getSqlManager().getJoinedActivities(id)
    .then(e => {
        const data = e;
        f.sqlManager.filterActivities(data);
        data.sort((a, b) => {
            const date = new Date(a.expires);
            const date2 = new Date(b.expires);
            return date.getTime() - date2.getTime();
        });
        res.json(buildSendDataPacket(data));
    })
    .catch(err => {
        console.log(err);
        res.json(buildInternalErrorPacket("Backend internal error."));
    })
});

router.post('/join/:id', tokenRequired, function (req, res, next) {
    const userId = parseInt(req.token.id);
    const activityId = parseInt(req.params.id);
    
    // TODO
});

// GET JoinedActivities that user not joined
router.get('/notjoined/:userId'), function (req, res, next) {
    JoinedActivities.findAll({where: { userId: req.params.userId }})
    .then((data) => res.json({ ok: true, data }))
    .catch((error) => res.json({ ok: false, error }))
}


export default router;