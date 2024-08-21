import fitmatch from "./../api/Fitmatch.js";
import express from 'express';
import { DataTypes } from "sequelize";
import { tokenRequired } from "./../api/utils/Validate.js";
import { buildInternalErrorPacket, buildInvalidPacket, buildNoDataFoundPacket, buildSendDataPacket, buildSimpleOkPacket } from "../api/packets/PacketBuilder.js";
import User from "../api/User.js";
import { sanitizeDataReceivedForArrayOfObjects, sanitizeDataReceivedForSingleObject } from "../api/utils/Sanitizers.js";

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

router.get('/feed', tokenRequired, function (req, res, next) {
    const id = req.token.id;

    sqlManager.getFriendsById(id).then(e => {
        const feed = new Map();
        const friendsData = sanitizeDataReceivedForArrayOfObjects(e, "friendId");
        function lastFilterActivities() {
            sqlManager.getRawJoinedActivities(id)
            .then(e => {
                const joinsData = sanitizeDataReceivedForArrayOfObjects(e, "userId");
                joinsData.forEach(item => feed.delete(item.postId));
                res.json(buildSendDataPacket(Array.from(feed.values())))
            })
            .catch(err => {
                console.log(err);
                res.json(buildInternalErrorPacket("Backend internal error. Check logs"));
            })
        }
        let indexx = 0;
        function recursiveFriends() {
            if (!friendsData[indexx]) {
                lastFilterActivities();
                return;
            }
            const friendId = friendsData[indexx].friendId;
            // get all activities
            sqlManager.getActivitiesFromUserId(friendId)
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
                        filtered.forEach(item => feed.set(item.id, item));
                        indexx++;
                        recursiveFriends();
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
        }
        recursiveFriends();
    })
});

/*router.get("/feed", tokenRequired, async function (req, res, next) {
    const id_user = req.token.id;
    
    try {
        // Obtiene las actividades del feed
        const activities = await sqlManager.getActivitiesFeed(id_user);
        
        if (activities && activities.length > 0) {
            // Crea un array para almacenar las promesas
            const friendsDataPromises = activities.map(async (activity) => {
                // Obtiene los datos de los amigos para cada actividad
                const friendsData = await sqlManager.getActivitiesFeedFriends(id_user, activity.activity_id);
                return {
                    ...activity,
                    friendsData
                };
            });

            // Espera a que todas las promesas se resuelvan
            const activitiesWithFriendsData = await Promise.all(friendsDataPromises);

            // Envía la respuesta con los datos completos
            res.json(buildSendDataPacket(activitiesWithFriendsData));
        } else {
            // Responde cuando no hay actividades en el feed
            res.json(buildNoDataFoundPacket());
        }
    } catch (error) {
        console.log(error);
        res.json(buildInternalErrorPacket("Backend internal error. Check logs."))
    }
});
*/


// POST, creación de un nuevo Activities
router.post('/create', tokenRequired, function (req, res, next) {

    // Obtener la fecha de expiración del cuerpo de la solicitud
    const expiresInput = req.body.expires ? new Date(req.body.expires) : null;
    if (!expiresInput) {
        res.json(buildInvalidPacket("You must specify the expiration date."));
        return;
    }

    const title = req.body.title;
    if (!title) {
        res.json(buildInvalidPacket("A title is required."));
        return;
    }

    const description = req.body.description ? req.body.description : null;

    // Crear un nuevo objeto con la data recibida y añadir los campos postDate y expires
    fitmatch.getSqlManager().createNewActivity(title, description, expiresInput, req.token.id)
        .then(e => {
            const id = sanitizeDataReceivedForSingleObject(e);
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
    const id = req.params.id;
    if (!id) {
        res.json(e => buildInvalidPacket("What is this id...?"));
        return;
    }

    // COMPROBAR
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
            const data = sanitizeDataReceivedForSingleObject(e);
            res.json(buildSendDataPacket(data));
        })
})

router.get("/getown", tokenRequired, (req, res, next) => {
    const id = req.token.id;

    fitmatch.sqlManager.getActivitiesFromUserId(id)
        .then(e => {
            const data = sanitizeDataReceivedForArrayOfObjects(e, "id");
            console.log(data);
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
        if (!data.userId !== id) {
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