import { QueryTypes } from "sequelize";
import fitmatch from "./../Fitmatch.js";
import { buildSendDataPacket } from "../packets/PacketBuilder.js";

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

     getJoinedActivities(id) {
        return fitmatch.sql.query(`SELECT joins_activities.* FROM joins_activities INNER JOIN activities ON joins_activities.postId = activities.id WHERE joins_activities.userId = ?;`, { replacements: [id], type: QueryTypes.SELECT });
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
        return fitmatch.sql.query(`DELETE FROM activities WHERE id = ?;`, { replacements: [id], type: QueryTypes.DELETE })
        .then(e => {
            return fitmatch.sql.query(`DELETE FROM joins_activities WHERE postId = ?`, { replacements: [id], type: QueryTypes.DELETE });
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
            injects.push(value);
            if (i + 1 < map.size) {
                str += ", ";
            }
            i++;
        });
        injects.push(user.id);
        return fitmatch.getSql().query(`UPDATE users SET ${str} WHERE id = ?`, { replacements: injects, type: QueryTypes.UPDATE });
    }

    putRejection(issuer, rejected) {
        const time = new Date((new Date().getTime() + TIME_BEFORE_EXPIRES)).toISOString().slice(0, 19).replace("T", " ");
        return fitmatch.getSql().query(`INSERT INTO rejects(issuer, rejected, expires) VALUES(?, ?, ?);`, { replacements: [ issuer.id, rejected.id, time ], type: QueryTypes.INSERT });
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