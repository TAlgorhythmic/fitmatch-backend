import express from 'express';
import f from "./../api/Fitmatch.js";
import { tokenRequired } from '../api/utils/Validate.js';
import { buildInternalErrorPacket, buildInvalidPacket, buildSendDataPacket, buildSimpleOkPacket } from '../api/packets/PacketBuilder.js';
import { sanitizeDataReceivedForArrayOfObjects, sanitizeDataReceivedForSingleObject } from '../api/utils/Sanitizers.js';

const router = express.Router();

router.get('/', tokenRequired, function (req, res, next) {
    const id = req.token.id;
    f.getSqlManager().getJoinedActivities(id)
    .then(e => {
        const data = sanitizeDataReceivedForArrayOfObjects(e, "id");
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
    const id = parseInt(req.token.id);
    const activityId = parseInt(req.params.id);
    
    f.getSqlManager().getActivityFromId(activityId)
    .then(e => {
        const data = sanitizeDataReceivedForSingleObject(e);
        if (!data) {
            res.json(buildInvalidPacket("This activity does not exist."));
            return;
        }
        f.getSqlManager().joinActivity(id, activityId)
        .then(e => {
            res.json(buildSimpleOkPacket());
        })
        .catch(err => {
            console.log(err);
            res.json(buildInternalErrorPacket("Backend internal error. Check logs."))
        })
    })
    .catch(err => {
        console.log(err);
        res.json(buildInternalErrorPacket("Backend internal error. Check logs."))
    })
});

// GET JoinedActivities that user not joined
router.get('/notjoined/:userId'), function (req, res, next) {
    JoinedActivities.findAll({where: { userId: req.params.userId }})
    .then((data) => res.json({ ok: true, data }))
    .catch((error) => res.json({ ok: false, error }))
}


export default router;