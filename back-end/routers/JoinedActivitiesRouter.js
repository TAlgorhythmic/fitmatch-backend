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

router.post("/leave/:id", tokenRequired, (req, res, next) => {
    f.getSqlManager().leaveActivity(req.token.id, req.params.id, res);
})

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
router.get('/notjoined'), tokenRequired, function (req, res, next) {
    f.getSqlManager().getAllActivities()
    .then(e => {
        const data = sanitizeDataReceivedForArrayOfObjects(e, "id");
        if (!data.length) {
            res.json(buildSendDataPacket([]));
            return;
        }
        f.getSqlManager().getJoinedActivities(req.token.id)
        .then(e1 => {
            const joinsData = sanitizeDataReceivedForArrayOfObjects(e1, "userId");
            if (!joinsData.length) {
                res.json(buildSendDataPacket([]));
                return;
            }
            const filtered = joinsData.filter(item => !data.find(item1 => item1.id === item.userId));
            res.json(buildSendDataPacket(filtered));
        })
    });
}


export default router;