import fitmatch from "./../api/Fitmatch.js";
import express from 'express';
import { tokenRequired } from "./../api/utils/Validate.js";
import { buildInternalErrorPacket, buildInvalidPacket, buildSendDataPacket, buildSimpleOkPacket } from "../api/packets/PacketBuilder.js";
import User from "../api/User.js";
import { sanitizeDataReceivedForArrayOfObjects, sanitizeDataReceivedForSingleObject } from "../api/utils/Sanitizers.js";
import Activity from "../api/Activity.js";
import FeedSession, { feedSessions } from "../api/utils/FeedSession.js";

const sqlManager = fitmatch.getSqlManager();

const router = express.Router();

// GET lista de todos los Activitiess
// vinculamos la ruta /api/Activitiess a la función declarada
// si todo ok devolveremos un objeto tipo:
//     {ok: true, data: [lista_de_objetos_Activities...]}
// si se produce un error:
//     {ok: false, error: mensaje_de_error}

// Not recommended
router.get('/', tokenRequired, function (req, res, next) {
    // get all activities
    sqlManager.getAllActivities()
        .then(activities => {
            // sanitize data
            const data = sanitizeDataReceivedForArrayOfObjects(activities, "id");
            // filter activities and remove expired ones.
            const filtered = sqlManager.filterActivities(data);
            // Index
            let i = 0;
            // Inject activity creator
            function recursive() {
                if (!filtered[i]) {
                    res.json(buildSendDataPacket(filtered));
                    return;
                }
                fitmatch.getSqlManager().getUserFromId(filtered[i].userId)
                    .then(e => {
                        const data = sanitizeDataReceivedForSingleObject(e);
                        const user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, data.city, data.latitude, data.longitude, data.isSetup, data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday, data.sunday, data.timetable1, data.timetable2);
                        filtered[i].user = user;
                        inject2();
                    })
                function inject2() {
                    // Inject every user object to
                    if (!filtered[i]) {
                        recursive();
                        return;
                    }
                    fitmatch.getSqlManager().getActivityJoins(filtered[i].id)
                        .then(e => {
                            const joinsData = sanitizeDataReceivedForArrayOfObjects(e, "userId");
                            const obj = [];
                            let index = 0;
                            function userRecursive() {
                                if (!joinsData[index]) {
                                    filtered[i].joinedUsers = obj;
                                    i++;
                                    recursive();
                                    return;
                                }
                                function recursiveNext() {
                                    index++;
                                    userRecursive();
                                }
                                const userId = joinsData[index].userId;
                                if (fitmatch.userManager.containsKey(userId)) {
                                    const user = fitmatch.userManager.get(userId).user;
                                    obj.push(user);
                                    recursiveNext();
                                } else {
                                    fitmatch.sqlManager.getUserFromId(userId)
                                        .then(e => {
                                            const innerUserData = sanitizeDataReceivedForSingleObject(e);
                                            const user = new User(innerUserData.id, innerUserData.name, innerUserData.lastname, innerUserData.email, innerUserData.phone, innerUserData.description, innerUserData.proficiency, innerUserData.trainingPreferences, innerUserData.img, innerUserData.city, innerUserData.latitude, innerUserData.longitude, innerUserData.isSetup, innerUserData.monday, innerUserData.tuesday, innerUserData.wednesday, innerUserData.thursday, innerUserData.friday, innerUserData.saturday, innerUserData.sunday, innerUserData.timetable1, innerUserData.timetable2, innerUserData.country);
                                            obj.push(user);
                                            recursiveNext();
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            res.json(buildInternalErrorPacket("Backend internal error. Check logs."))
                                        })
                                }
                            }
                            userRecursive();
                        })
                        .catch(err => {
                            console.log(err);
                            res.json(buildInternalErrorPacket("Backend internal error. Check logs."))
                        })
                }
            }
            // Run recursive
            recursive();

        })
        .catch(error => {
            console.log(error);
            res.json(
                buildInvalidPacket("Backend internal error.")
            )
        });
});

router.get("/feedsession", tokenRequired, async (req, res, next) => {
const id = req.token.id;

    try {
        const fd = await sqlManager.getFriendsById(id);
        const friendsData = sanitizeDataReceivedForArrayOfObjects(fd, "friendId");

        const include = new Set();
        friendsData.forEach(item => include.add(item.friendId));
        
        const f0 = await sqlManager.getRawJoinedActivities(id);
        const raw0 = new Set();
    
        const temp = sanitizeDataReceivedForArrayOfObjects(f0, "userId");

        temp.forEach(e => raw0.add(e.postId));

        let user;

        if (fitmatch.userManager.containsKey(id)) user = fitmatch.userManager.get(id).user;
        else {
            const uD = await sqlManager.getUserFromId(id);
            const userData = sanitizeDataReceivedForSingleObject(uD);
            user = new User(userData.id, userData.name, userData.lastname, userData.email, userData.phone, userData.description, userData.proficiency, )
        }

        feedSessions.set(id, new FeedSession(user, include, raw0));

        const feed = feedSessions.get(id).getMore();
            
        for (const activity of feed) {
            let user;

            if (fitmatch.userManager.containsKey(activity.userId)) user = fitmatch.userManager.get(activity.userId).user;
            else {
                const usr = await sqlManager.getUserFromId(activity.userId);
                const data = sanitizeDataReceivedForSingleObject(usr);
                user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, data.city, data.latitude, data.longitude, data.isSetup, data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday, data.sunday, data.timetable1, data.timetable2);
            }

            activity.user = user;

            const jns = await sqlManager.getActivityJoins(activity.id);
            const joins = sanitizeDataReceivedForArrayOfObjects(jns, "userId");
            const obj = [];

            for (const join of joins) {
                const joinUsr = await sqlManager.getUserFromId(join.userId);
                const joinedUser = sanitizeDataReceivedForSingleObject(joinUsr);
                const user = new User(joinedUser.id, joinedUser.name, joinedUser.lastname, joinedUser.email, joinedUser.phone, joinedUser.description, joinedUser.proficiency, joinedUser.trainingPreferences, joinedUser.img, joinedUser.city, joinedUser.latitude, joinedUser.longitude, joinedUser.isSetup, joinedUser.monday, joinedUser.tuesday, joinedUser.wednesday, joinedUser.thursday, joinedUser.friday, joinedUser.saturday, joinedUser.sunday, joinedUser.timetable1, joinedUser.timetable2);
                if (user.id !== activity.userId) obj.push(user);
            }

            activity.joinedUsers = obj;
        }

        res.json(buildSendDataPacket(feed));
    } catch (err) {
        console.log(err);
        res.json(buildInternalErrorPacket("Backend internal error. Check logs."));
    }
});

router.get('/feed', tokenRequired, async function (req, res, next) {
    const id = req.token.id;

    if (!feedSessions.has(id)) {
        res.json(buildInvalidPacket("You have to create a feed session first!"));
        return;
    }

    try {
        const feed = feedSessions.get(id).getMore();
            
        for (const activity of feed) {

            let user;

            if (fitmatch.userManager.containsKey(activity.userId)) user = fitmatch.userManager.get(activity.userId).user;
            else {
                const usr = await sqlManager.getUserFromId(activity.userId);
                const data = sanitizeDataReceivedForSingleObject(usr);
                user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, data.city, data.latitude, data.longitude, data.isSetup, data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday, data.sunday, data.timetable1, data.timetable2);
            }

            activity.user = user;

            const jns = await sqlManager.getActivityJoins(activity.id);
            const joins = sanitizeDataReceivedForArrayOfObjects(jns, "userId");
            const obj = [];

            for (const join of joins) {
                const joinUsr = await sqlManager.getUserFromId(join.userId);
                const joinedUser = sanitizeDataReceivedForSingleObject(joinUsr);
                const user = new User(joinedUser.id, joinedUser.name, joinedUser.lastname, joinedUser.email, joinedUser.phone, joinedUser.description, joinedUser.proficiency, joinedUser.trainingPreferences, joinedUser.img, joinedUser.city, joinedUser.latitude, joinedUser.longitude, joinedUser.isSetup, joinedUser.monday, joinedUser.tuesday, joinedUser.wednesday, joinedUser.thursday, joinedUser.friday, joinedUser.saturday, joinedUser.sunday, joinedUser.timetable1, joinedUser.timetable2);
                if (user.id !== activity.userId) obj.push(user);
            }

            activity.joinedUsers = obj;
        }

        res.json(buildSendDataPacket(feed));
    } catch (err) {
        console.log(err);
        res.json(buildInternalErrorPacket("Backend internal error. Check logs."));
    }
});

// POST, creación de un nuevo Activities
router.post('/create', tokenRequired, function (req, res, next) {

    const title = req.body.title;
    if (!title) {
        res.json(buildInvalidPacket("Title is empty."));
        return;
    }
    const description = req.body.description ? req.body.description : "";
    const expires = req.body.expires ? new Date(req.body.expires) : null;
    if (!expires) {
        res.json(buildInvalidPacket("Expiration date is invalid."));
        return;
    }

    const placeholder = req.body.placeholder;
    if (!placeholder) {
        res.json(buildInvalidPacket("Placeholder is empty."));
        return;
    }
    const lat = req.body.latitude;
    const long = req.body.longitude;
    if (!lat || !long) {
        res.json(buildInvalidPacket("The location is not correctly set."));
        return;
    }
    const latitude = typeof lat !== "string" ? lat.toString() : lat;
    const longitude = typeof long !== "string" ? long.toString() : long;

    // Crear un nuevo objeto con la data recibida y añadir los campos postDate y expires
    fitmatch.getSqlManager().createNewActivity(title, description, expires, placeholder, latitude, longitude, req.token.id)
        .then(e => {
            const id = sanitizeDataReceivedForSingleObject(e);
            const activity = new Activity(id, title, description, new Date(), expires, req.token.id, placeholder, latitude, longitude);
            fitmatch.activitiesManager.put(id, activity);
            res.json(buildSimpleOkPacket());
            fitmatch.sqlManager.joinActivity(req.token.id, id)
                .catch(err => {
                    console.warn("Warning! Failed to join recently created activity, might result in unexpected behaviour.");
                    console.warn(err);
                })

        }).catch(err => {
            console.log(err);
            res.json(buildInternalErrorPacket("Backend internal error. Check logs."));
        });
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
    const id = parseInt(req.params.id);

    if (!fitmatch.activitiesManager.containsKey(id)) {
        res.json(buildInvalidPacket("This activity does not exist."));
        return;
    }

    const title = req.body.title;
    if (!title) {
        res.json(buildInvalidPacket("Title is empty."));
        return;
    }
    const description = req.body.description ? req.body.description : null;
    const expires = req.body.expires ? new Date(req.body.expires) : "";
    if (!expires) {
        res.json(buildInvalidPacket("Expiration date is invalid."));
        return;
    }

    const placeholder = req.body.placeholder;
    if (!placeholder) {
        res.json(buildInvalidPacket("Placeholder is empty."));
        return;
    }
    const lat = req.body.latitude;
    const long = req.body.longitude;
    if (!lat || !long) {
        res.json(buildInvalidPacket("The location is not correctly set."));
        return;
    }
    const latitude = typeof lat !== "string" && !(lat instanceof String) ? lat.toString() : lat;
    const longitude = typeof long !== "string" && !(long instanceof String) ? long.toString() : long;

    const activity = fitmatch.activitiesManager.get(id).activity;
    activity.setTitle(title);
    activity.setDescription(description);
    activity.setExpires(expires);
    activity.setPlaceholder(placeholder);
    activity.setLatitude(latitude);
    activity.setLongitude(longitude)

    res.json(buildSimpleOkPacket());
});

router.get("/get/:id", tokenRequired, (req, res, next) => {
    const activityId = parseInt(req.params.id);

    if (!fitmatch.activitiesManager.containsKey(activityId)) {
        res.json(buildInvalidPacket("This activity does not exist."));
        return;
    }

    res.json(buildSendDataPacket(fitmatch.activitiesManager.get(activityId).activity));
})

router.get("/getown", tokenRequired, (req, res, next) => {
    const id = req.token.id;

    fitmatch.sqlManager.getActivitiesFromUserId(id)
        .then(e => {
            const data = sanitizeDataReceivedForArrayOfObjects(e, "id");
            const filtered = sqlManager.filterActivities(data);
            let i = 0;
            // Inject activity creator
            function recursive() {
                if (!filtered[i]) {
                    res.json(buildSendDataPacket(filtered));
                    return;
                }
                function inject2() {
                    // Inject every user object to
                    if (!filtered[i]) {
                        recursive();
                        return;
                    }
                    fitmatch.getSqlManager().getActivityJoins(filtered[i].id)
                        .then(e => {
                            const joinsData = sanitizeDataReceivedForArrayOfObjects(e, "userId");
                            const obj = [];
                            let index = 0;
                            function userRecursive() {
                                if (!joinsData[index]) {
                                    filtered[i].joinedUsers = obj;
                                    i++;
                                    recursive();
                                    return;
                                }
                                function recursiveNext() {
                                    index++;
                                    userRecursive();
                                }
                                const userId = joinsData[index].userId;
                                if (fitmatch.userManager.containsKey(userId)) {
                                    const user = fitmatch.userManager.get(userId).user;
                                    obj.push(user);
                                    recursiveNext();
                                } else {
                                    fitmatch.sqlManager.getUserFromId(userId)
                                        .then(e => {
                                            const innerUserData = sanitizeDataReceivedForSingleObject(e);
                                            const user = new User(innerUserData.id, innerUserData.name, innerUserData.lastname, innerUserData.email, innerUserData.phone, innerUserData.description, innerUserData.proficiency, innerUserData.trainingPreferences, innerUserData.img, innerUserData.city, innerUserData.latitude, innerUserData.longitude, innerUserData.isSetup, innerUserData.monday, innerUserData.tuesday, innerUserData.wednesday, innerUserData.thursday, innerUserData.friday, innerUserData.saturday, innerUserData.sunday, innerUserData.timetable1, innerUserData.timetable2, innerUserData.country);
                                            obj.push(user);
                                            recursiveNext();
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            res.json(buildInternalErrorPacket("Backend internal error. Check logs."))
                                        })
                                }
                            }
                            userRecursive();
                        })
                        .catch(err => {
                            console.log(err);
                            res.json(buildInternalErrorPacket("Backend internal error. Check logs."))
                        })
                }
                inject2();
            }
            // Run recursive
            recursive();
        })
        .catch(err => {
            console.log(err);
            res.json(buildInternalErrorPacket("Backend internal error. Check logs."))
        })
});

router.delete("/delete/:id", tokenRequired, (req, res, next) => {
    const id = req.token.id;
    const activityId = req.params.id;

    fitmatch.getSqlManager().getActivityFromId(activityId).then(e => {
        const data = sanitizeDataReceivedForSingleObject(e);
        if (!data) {
            res.json(buildInvalidPacket("This activity does not exist."));
            return;
        }
        if (data.userId !== id) {
            res.json(buildInvalidPacket("You are not allowed to do this."));
            return;
        }
        fitmatch.sqlManager.removeActivityCompletely(activityId);
        res.json(buildSimpleOkPacket());
    })
        .catch(err => {
            console.log(err);
            res.json(buildInternalErrorPacket("Backend internal error. Check logs."));
        })
})

export default router;