import { QueryTypes } from "sequelize";
import fitmatch from "./../Fitmatch.js";

const TABLES_VERSION = 0;
const TIME_BEFORE_EXPIRES = 48 * 60 * 60 * 1000;

class SQLManager {
    constructor() {}

    async getAllActivities() {
        return await fitmatch.getSql().query("SELECT * FROM activities;")
    }

    async getJoinedActivities(id) {
        return await fitmatch.sql.query(`SELECT joins_activities.* FROM joins_activities INNER JOIN activities ON joins_activities.postId = activities.id WHERE joins_activities.userId = ?;`, { replacements: [id], type: QueryTypes.SELECT });
    }

    async destroyUserCompletely(id) {
        await fitmatch.getSql().query("DELETE FROM users WHERE id = ?;", { replacements: [id], type: QueryTypes.DELETE })
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

    async removeActivityCompletely(id) {
        await fitmatch.sql.query(`DELETE FROM activities WHERE id = ?;`, { replacements: [id], type: QueryTypes.DELETE })
        .then(e => {
            return fitmatch.sql.query(`DELETE FROM joins_activities WHERE postId = ?`, { replacements: [id], type: QueryTypes.DELETE });
        })
        .catch(err => console.log("Operation remove activity completely failed. Error: " + err));
    }

    async getActivityFromId(id) {
        return await fitmatch.getSql().query("SELECT * FROM activities WHERE id = ?;", { replacements: [id], type: QueryTypes.SELECT });
    }

    /**
     * @returns a promise
     */
    async getAllUsers() {
        return await fitmatch.getSql().query("SELECT * FROM users;");
    }

    async getAllUsersWithLimitOffset(limit, offset) {
        return await fitmatch.getSql().query("SELECT * FROM users LIMIT ? OFFSET ?;", { replacements: [limit, offset], type: QueryTypes.SELECT });
    }

    /**
     * @returns a promise
     */
    async getUserFromId(id) {
        return await fitmatch.getSql().query(`SELECT * FROM users WHERE id = ?;`, { replacements: [id], type: QueryTypes.SELECT });
    }

    async setUserImage(id, image) {
        return await fitmatch.getSql().query(`UPDATE users SET img = ? WHERE id = ?;`, { replacements: [ image, id ], type: QueryTypes.UPDATE });
    }

    /**
     * @returns a promise
     */
    async getUserFromEmail(email) {
        return await fitmatch.getSql().query(`SELECT * FROM users WHERE email = ?;`, { replacements: [email], type: QueryTypes.SELECT });
    }

    /**
     * @returns a promise
     */
    async getUserFromNumber(number) {
        return await fitmatch.getSql().query(`SELECT * FROM users WHERE phone = ?;`, { replacements: [number], type: QueryTypes.SELECT });
    }

    async createNewUser(name, lastname, provider, email, phone, hash) {
        return await fitmatch.getSql().query(`INSERT INTO users(name, lastname, provider, email, phone, pwhash, tableVersion) VALUES(?, ?, ?, ?, ?, ?, ${TABLES_VERSION});`, { replacements: [ name, lastname, provider, email, phone, hash ], type: QueryTypes.INSERT })
    }

    async createNewUserWithId(id, name, lastname, provider, email, phone, hash) {
        return await fitmatch.getSql().query(`INSERT INTO users(id, name, lastname, provider, email, phone, pwhash, tableVersion) VALUES(?, ?, ?, ?, ?, ?, ?, ${TABLES_VERSION})`, { replacements: [ id, name, lastname, provider, email, phone, hash ], type: QueryTypes.INSERT });
    }

    async updateUser(user) {
        return await fitmatch.getSql().query(
            `UPDATE users SET name = ?, lastname = ?, phone = ?, description = ?, proficiency = ?, trainingPreferences = ?, img = ?, city = ?, latitude = ?, longitude = ?, isSetup = ?, tableVersion = ${TABLES_VERSION} WHERE id = ?`,
            { replacements: [ user.name, user.lastname, user.phone, user.description, user.proficiency, user.trainingPreferences, user.img, user.city, user.latitude, user.longitude, user.isSetup, user.id ] }
        )
    }

    async selectivelyUpdateUser(user, map) {
        let str = "";
        const injects = [];
        let i = 0;
        map.forEach((value, key) => {
            str += `? = ?`;
            injects.push(key, value);
            if (i !== 0 && i + 1 !== map.size) {
                str += ", ";
            }
            i++;
        });
        injects.push(user.id);
        return await fitmatch.getSql().query(`UPDATE user SET ${str} WHERE id = ?`, { replacements: injects, type: QueryTypes.UPDATE });
    }

    async putRejection(issuer, rejected) {
        const time = new Date((new Date().getTime() + TIME_BEFORE_EXPIRES)).toISOString().slice(0, 19).replace("T", " ");
        return await fitmatch.getSql().query(`INSERT INTO rejects(issuer, rejected, expires) VALUES(?, ?, ?);`, { replacements: [ issuer.id, rejected.id, time ], type: QueryTypes.INSERT });
    }

    /**
     * 
     */
    async getAllActivitiesWhitUserInfo() {
        return await fitmatch.getSql().query(`SELECT activities.*, users.name, users.img FROM activities INNER JOIN users ON activities.userId = users.id;`);
    }
}

const sqlManager = new SQLManager();
export default sqlManager;