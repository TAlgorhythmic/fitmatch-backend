import fitmatch from "./../Fitmatch.js";

class SQLManager {
    constructor() {}

    /**
     * @returns a promise
     */
    getAllUsers() {
        return fitmatch.getSql().query("SELECT * FROM users;");
    }

    /**
     * @returns a promise
     */
    getUserFromId(id) {
        return fitmatch.getSql().query(`SELECT * FROM users WHERE id = "${id}";`);
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
        return fitmatch.getSql().query(`INSERT INTO users(name, lastname, email, phone, pwhash) VALUES("${name}", "${lastname}", "${email}", "${phone}", "${hash}");`)
    }

    updateUser(user) {
        return fitmatch.getSql().query(`UPDATE users SET name = "${user.name}", lastname = "${user.lastname}", phone = "${user.phone}", description = "${user.description}", proficiency = "${user.proficiency}", trainingPreferences = "${user.trainingPreferences}", img = "${user.img}", location = "${user.city}||${user.coordinates}", isSetup = ${user.isSetup} WHERE id = ${user.id}`)
    }
}

const sqlManager = new SQLManager();
export default sqlManager;