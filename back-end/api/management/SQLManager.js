import fitmatch from "./../Fitmatch.js";

class SQLManager {
    constructor() {}

    getAllUsers() {
        fitmatch.getSql().query("SELECT * FROM users;");
    }

    getUserFromId(id) {
        fitmatch.getSql().query("");
    }

    getUserFromEmail(email) {

    }

    getUserFromNumber(number) {

    }
}