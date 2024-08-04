import { QueryTypes } from "sequelize";
import fitmatch from "./../Fitmatch.js";

const TABLES_VERSION = 0;
const TIME_BEFORE_EXPIRES = 48 * 60 * 60 * 1000;

class SQLManager {
    constructor() {}

    getAllActivities() {
        return fitmatch.getSql().query("SELECT * FROM activities;")
    }

    getJoinedActivities(id) {
        return fitmatch.sql.query(`SELECT joins_activities.* FROM joins_activities INNER JOIN activities ON joins_activities.postId = activities.id WHERE joins_activities.userId = ?;`, { replacements: [id], type: QueryTypes.SELECT });
    }

    removeActivityCompletely(id) {
        fitmatch.sql.query(`DELETE FROM activities WHERE id = ?;`, { replacements: [id], type: QueryTypes.DELETE })
        .then(e => {
            return fitmatch.sql.query(`DELETE FROM joins_activities WHERE postId = ?`, { replacements: [id], type: QueryTypes.DELETE });
        })
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
        return fitmatch.getSql().query(`SELECT * FROM users WHERE email = ?;`, { replacements: [email], type: QueryTypes.SELECT });
    }

    /**
     * @returns a promise
     */
    getUserFromNumber(number) {
        return fitmatch.getSql().query(`SELECT * FROM users WHERE phone = ?;`, { replacements: [number], type: QueryTypes.SELECT });
    }

    createNewUser(name, lastname, provider, email, phone, hash) {
        return fitmatch.getSql().query(`INSERT INTO users(name, lastname, provider, email, phone, pwhash, tableVersion) VALUES(?, ?, ?, ?, ?, ?, ${TABLES_VERSION});`, { replacements: [ name, lastname, provider, email, phone, hash ], type: QueryTypes.INSERT })
    }

    createNewUserWithId(id, name, lastname, provider, email, phone, hash) {
        return fitmatch.getSql().query(`INSERT INTO users(id, name, lastname, provider, email, phone, pwhash, tableVersion) VALUES(?, ?, ?, ?, ?, ?, ?, ${TABLES_VERSION})`, { replacements: [ id, name, lastname, provider, email, phone, hash ], type: QueryTypes.INSERT });
    }

    updateUser(user) {
        return fitmatch.getSql().query(
            `UPDATE users SET name = ?, lastname = ?, phone = ?, description = ?, proficiency = ?, trainingPreferences = ?, img = ?, city = ?, latitude = ?, longitude = ?, isSetup = ?, tableVersion = ${TABLES_VERSION} WHERE id = ?`,
            { replacements: [ user.name, user.lastname, user.phone, user.description, user.proficiency, user.trainingPreferences, user.img, user.city, user.latitude, user.longitude, user.isSetup, user.id ] }
        )
    }

    selectivelyUpdateUser(user, map) {
        const str = "";
        const injects = [];
        let i = 0;
        map.forEach((value, key) => {
            str += `? = ?`;
            injects.push(key, value);
            if (i !== 0 && i + 1 !== map.size) {
                str += str += ", "
            }
            i++;
        });
        injects.push(user.id);
        return fitmatch.getSql().query(`UPDATE user SET ${str} WHERE id = ?`, { replacements: injects, type: QueryTypes.UPDATE });
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
}

const sqlManager = new SQLManager();
export default sqlManager;