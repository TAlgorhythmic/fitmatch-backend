import { QueryTypes } from "sequelize";
import fitmatch from "./../Fitmatch.js";
import { buildInternalErrorPacket, buildInvalidPacket, buildSendDataPacket, buildSimpleOkPacket } from "../packets/PacketBuilder.js";
import { sanitizeDataReceivedForSingleObject } from "../utils/Sanitizers.js";

const TABLES_VERSION = 0;
const TIME_BEFORE_EXPIRES = 48 * 60 * 60 * 1000;

export function isActivityExpired(activity) {
    const date = new Date(activity.expires);
    return Date.now <= date.getTime();
}

export function removeGarbage(millis) {
    setTimeout(() => {
        function recursive() {
            const itemToRemove = garbage.pop();
            if (!itemToRemove) {
                console.log("Activities table is now clean.");
                return;
            }
            try {
                fitmatch.getSqlManager().removeActivityCompletely(itemToRemove.id)
                    .then(e => {
                        console.log(`Unused/expired activity: ${itemToRemove.id} removed successfully!`);
                        return;
                    });
            } catch (err) {
                console.log(err);
            } finally {
                recursive();
            }
        }
        recursive();
    }, millis);
}

export const garbage = [];

class SQLManager {
    constructor() {}

    getAllActivities() {
        return fitmatch.getSql().query("SELECT * FROM activities;")
    }

    sendConnectionRequest(id, other_id) {
        return fitmatch.sql.query("INSERT INTO pending(sender_id, receiver_id) VALUES(?, ?);", { replacements: [id, other_id], type: QueryTypes.INSERT });
    }

    leaveActivity(id, activityId, res) {
        this.getJoinedActivity(id, activityId)
        .then(e => {
            const data = sanitizeDataReceivedForSingleObject(e);
            if (!data) {
                res.json(buildInvalidPacket("You can't leave an activity you didn't join."));
                return;
            }
            fitmatch.getSql().query("DELETE FROM joins_activities WHERE userId = ? AND postId = ?;", { replacements: [id, activityId], type: QueryTypes.DELETE })
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
        });
    }

    getJoinedActivity(id, activityId) {
        return fitmatch.getSql().query("SELECT * FROM joins_activities WHERE userId = ? AND postId = ?;", { replacements: [id, activityId], type: QueryTypes.SELECT });
    }

    getReceiverPendingsFromId(id) {
        return fitmatch.sql.query("SELECT * FROM pending WHERE receiver_id = ?;", { replacements: [id], type: QueryTypes.SELECT });
    }

    getJoinedActivities(id) {
        return fitmatch.sql.query(`SELECT activities.* FROM joins_activities INNER JOIN activities ON joins_activities.postId = activities.id WHERE joins_activities.userId = ?;`, { replacements: [id], type: QueryTypes.SELECT });
    }

    putFriends(id1, id2) {
        return fitmatch.sql.query("INSERT INTO friends(userId1, userId2) VALUES(?, ?);", { replacements: [id1, id2], type: QueryTypes.INSERT });
    }

    getActivityFromId(id) {
        return fitmatch.sql.query("SELECT * FROM activities WHERE id = ?;", { replacements: [id], type: QueryTypes.SELECT });
    }

    destroyUserCompletely(id) {
        fitmatch.getSql().query("DELETE FROM users WHERE id = ?;", { replacements: [id], type: QueryTypes.DELETE })
            .then(e => {
                fitmatch.getSql().query("DELETE FROM days_of_week WHERE userId = ?;", { replacements: [id], type: QueryTypes.DELETE })
                .then(e => {
                    fitmatch.getSql()
                })
            })
            .catch(e => {
                console.log("Operation destroy user failed. Error: " + e);
            });
    }

    removeActivityCompletely(id) {
        fitmatch.sql.query(`DELETE FROM activities WHERE id = ?;`, { replacements: [id], type: QueryTypes.DELETE })
        .then(e => {
            fitmatch.sql.query(`DELETE FROM joins_activities WHERE postId = ?`, { replacements: [id], type: QueryTypes.DELETE })
            .catch(err => console.log(err));
        })
        .catch(err => console.log("Operation remove activity completely failed. Error: " + err));
    }

    getActivityFromId(id) {
        return fitmatch.getSql().query("SELECT * FROM activities WHERE id = ?;", { replacements: [id], type: QueryTypes.SELECT });
    }

    /**
     * @returns a promise
     */
    getAllUsers() {
        return fitmatch.getSql().query("SELECT * FROM users;");
    }

    getAllUsersWithLimitOffset(limit, offset) {
        return fitmatch.getSql().query("SELECT * FROM users LIMIT ? OFFSET ?;", { replacements: [limit, offset], type: QueryTypes.SELECT });
    }

    /**
     * @returns a promise
     */
    getUserFromId(id) {
        return fitmatch.getSql().query(`SELECT * FROM users WHERE id = ?;`, { replacements: [id], type: QueryTypes.SELECT });
    }

    setUserImage(id, image) {
        return fitmatch.getSql().query(`UPDATE users SET img = ? WHERE id = ?;`, { replacements: [ image, id ], type: QueryTypes.UPDATE });
    }

    /**
     * @returns a promise
     */
    getUserFromEmail(email) {
        return fitmatch.getSql().query("SELECT * FROM users WHERE email = ?;", { replacements: [email], type: QueryTypes.SELECT });
    }

    joinActivity(id, activityId) {
        return fitmatch.sql.query("INSERT INTO joins_activities (userId, postId) VALUES(?, ?);", { replacements: [id, activityId], type: QueryTypes.INSERT });
    }

    /**
     * @returns a promise
     */
    getUserFromNumber(number) {
        return fitmatch.getSql().query(`SELECT * FROM users WHERE phone = ?;`, { replacements: [ number ], type: QueryTypes.SELECT });
    }

    createNewUser(name, lastname, provider, email, phone, hash) {
        const ln = lastname ? lastname : null;
        const ph = phone ? phone : null;
        return fitmatch.getSql().query(`INSERT INTO users(name, lastname, provider, email, phone, pwhash, tableVersion) VALUES(?, ?, ?, ?, ?, ?, ${TABLES_VERSION});`, { replacements: [ name, ln, provider, email, ph, hash ], type: QueryTypes.INSERT })
    }

    updateUser(user) {
        return fitmatch.getSql().query(
            `UPDATE users SET name = ?, lastname = ?, phone = ?, description = ?, proficiency = ?, trainingPreferences = ?, img = ?, city = ?, latitude = ?, longitude = ?, isSetup = ?, tableVersion = ${TABLES_VERSION} WHERE id = ?`,
            { replacements: [ user.name, user.lastname, user.phone, user.description, user.proficiency, user.trainingPreferences, user.img, user.city, user.latitude, user.longitude, user.isSetup, user.id ] }
        )
    }

    selectivelyUpdateUser(user, map) {
        let str = "";
        const injects = [];
        let i = 0;
        map.forEach((value, key) => {
            str += `${key} = ?`;
            //TODO
            if (key === "trainingPreferences") {
                injects.push(value);
            } else {
                injects.push(value);
            }
            
            if (i < map.size) {
                str += ", ";
            }
            i++;
        });
        injects.push(user.id);
        return fitmatch.getSql().query(`UPDATE users SET ${str} WHERE id = ?`, { replacements: injects, type: QueryTypes.UPDATE });
    }

    putRejection(issuer, rejected) {
        const time = new Date((new Date().getTime() + TIME_BEFORE_EXPIRES)).toISOString().slice(0, 19).replace("T", " ");
        return fitmatch.getSql().query(`INSERT INTO rejects(issuer, rejected, expires) VALUES(?, ?, ?);`, { replacements: [ issuer, rejected, time ], type: QueryTypes.INSERT });
    }

    /**
     * 
     */
    getAllActivitiesWhitUserInfo() {
        return fitmatch.getSql().query(`SELECT activities.*, users.name, users.img FROM activities INNER JOIN users ON activities.userId = users.id;`);
    }

    filterActivities(array) {
        return array.filter(item => {
            const isExpired = isActivityExpired(item);
            if (isExpired) {
                garbage.push(item);
            }
            return !isExpired;
        })
    }

    updateActivity(id, title, description, expires, res) {
        const validChanges = [];
        let titl;
        let desc;
        let expire;
        if (title) {titl = "title = ? "; validChanges.push(title)} else titl = "";
        if (description) {desc = "description = ? "; validChanges.push(description)} else desc = "";
        if (expires) {expire = "expires = ? "; validChanges.push(expires)} else expire = "";
        if (!titl && !desc && !expire) {
            res.json(buildInvalidPacket("Every single piece of data received is invalid. Could not effectuate query."));
            return;
        }
        return fitmatch.getSql().query(`UPDATE activities SET title = ? description = ? expires = ? WHERE id = ?`, { replacements: [title, description, expires, id], type: QueryTypes.UPDATE })
    }

    getRejectionByPair(id1, id2) {
        return fitmatch.sql.query(`SELECT CASE WHEN issuer = ? THEN rejected ELSE issuer END AS friendId FROM friends WHERE issuer = ? OR rejected = ?;`, { replacements: [id1, id1, id2] });
    }

    // TODO todo mal
    getActivitiesFeed(id, res) {
        fitmatch.getSql().query(`SELECT CASE WHEN userId1 = ? THEN userId2 ELSE userId1 END AS friendId FROM friends WHERE userId1 = ? OR userId2 = ?;`, { replacements: [id, id, id], type: QueryTypes.SELECT })
        .then(e => {
            const data = e[0];
            if (!data.length) {
                res.json(buildSendDataPacket([]));
                return;
            }

            function sendData(feed) {
                const filtered = this.filterActivities(feed);
                filtered.sort((a, b) => {
                    const timeLeftA = new Date(a.expires).getTime() - Date.now();
                    const timeLeftB = new Date(b.expires).getTime() - Date.now();
                    return timeLeftA - timeLeftB;
                })
                res.json(buildSendDataPacket(filtered));
            }
            let i = 0;
            const feed = [];
            function recursive() {
                this.getActivitiesFromUserId(data[i])
                .then(e => {
                    const activitiesData = e[0];
                    activitiesData.forEach(item => feed.push(item));
                    
                }).catch(err => console.log(err)).finally(e => {
                    i++;
                    if (data[i]) recursive;
                    else sendData(feed);
                })
            }
            recursive();
        })
    }

    getActivitiesFromUserId(id) {
        return fitmatch.sql.query("SELECT * FROM activities WHERE userId = ?;", { replacements: [id], type: QueryTypes.SELECT });
    }

    getAllPendings(id) {
        return fitmatch.getSql().query(`SELECT u.* FROM pending p JOIN users u ON p.sender_id = u.id WHERE p.receiver_id = ?;`, { replacements: [id], type: QueryTypes.SELECT });
    }
}

const sqlManager = new SQLManager();
export default sqlManager;