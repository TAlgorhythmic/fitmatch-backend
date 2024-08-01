import fitmatch from "./../Fitmatch.js";

const TABLES_VERSION = 0;
const TIME_BEFORE_EXPIRES = 48 * 60 * 60 * 1000;

class SQLManager {
    constructor() {}

    /**
     * @returns a promise
     */
    getAllUsers() {
        return fitmatch.getSql().query("SELECT * FROM users;");
    }

    getAllUsersWithLimitOffset(limit, offset) {
        return fitmatch.getSql().query("Select * FROM users LIMIT " + limit + " OFFSET " + offset + ";");
    }

    /**
     * @returns a promise
     */
    getUserFromId(id) {
        return fitmatch.getSql().query(`SELECT * FROM users WHERE id = "${id}";`);
    }

    setUserImage(id, image) {
        return fitmatch.getSql().query(`UPDATE users SET img = "${image}" WHERE id = ${id};`);
    }

    /**
     * @returns a promise
     */
    getUserFromEmail(email) {
        return fitmatch.getSql().query(`SELECT * FROM users WHERE email = "${email}";`);
    }

    /**
     * @returns a promise
     */
    getUserFromNumber(number) {
        return fitmatch.getSql().query(`SELECT * FROM users WHERE phone = "${number}";`);
    }

    createNewUser(name, lastname, email, phone, hash) {
        return fitmatch.getSql().query(`INSERT INTO users(name, lastname, email, phone, pwhash, tableVersion) VALUES("${name}", "${lastname}", "${email}", "${phone}", "${hash}", ${TABLES_VERSION});`)
    }

    updateUser(user) {
        return fitmatch.getSql().query(`UPDATE users SET name = "${user.name}", lastname = "${user.lastname}", phone = "${user.phone}", description = "${user.description}", proficiency = "${user.proficiency}", trainingPreferences = "${user.trainingPreferences}", img = "${user.img}", location = "${user.city}||${user.latitude};${user.longitude}", isSetup = ${user.isSetup}, tableVersion = ${TABLES_VERSION} WHERE id = ${user.id}`)
    }

    selectivelyUpdateUser(user, map) {
        const str = "";
        let i = 0;
        map.forEach((value, key) => {
            str += `${key} = "${value}"`;
            if (i !== 0 && i + 1 !== map.size) {
                str += str += ", "
            }
            i++;
        });
        return fitmatch.getSql().query(`UPDATE user SET ${str} WHERE id = ${user.id}`);
    }

    putRejection(issuer, rejected) {
        return fitmatch.getSql().query(`INSERT INTO rejects(issuer, rejected, expires) VALUES(${issuer.id}, ${rejected.id}, ${new Date((new Date().getTime() + TIME_BEFORE_EXPIRES)).toISOString().slice(0, 19).replace("T", " ")});`);
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