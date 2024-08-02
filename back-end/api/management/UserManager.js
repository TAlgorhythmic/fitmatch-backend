import User from "../User.js";
import fitmatch from "./../Fitmatch.js";

const TIMEOUT = 512000;

/**
 * Important! Use setters for updating values.
 */
class UserManager {
    constructor() {
        this.map = new Map();
    }

    put(id, user) {
        const ref = new Ref(user, this.map);
        this.map.set(id, ref);
    }

    containsKey(id) {
        return this.map.has(id);
    }

    get(id) {
        const user = this.map.get(id);
        if (user) user.onRead();
        return user;
    }

    async getOrLoad(id) {
        if (!this.containsKey(id)) {
            fitmatch.sqlManager.getUserFromId(id)
            .then(e => {
                const data = e[0];
                const user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, data.city, data.latitude, data.longitude, data.isSetup);
                this.put(user.id, new Ref(user, this.map));
                return user;
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
        } else {
            return this.get(id).user;
        }
    }
}

class Ref {
    constructor(user, map) {
        this.user = user;
        this.modified = new Date();;
        this.map = map;
        this.checkOrDelete();
        this.saveList = new Map();
    }

    onRead() {
        this.modified = new Date();
    }

    onModify(field, value) {
        this.modified = new Date();
        this.pushChange(field, value);
    }

    pushChange(field, value) {
        this.saveList.set(field, value);
    }

    periodicallySave() {
        setTimeout(() => {
            this.save();
            if (this.map.has(user.id)) {
                this.periodicallySave();
            } else return;
        }, 60000);
    }

    save() {
        if (this.saveList.size) {
            fitmatch.getSqlManager().selectivelyUpdateUser(this.user, this.saveList);
        }
    }

    checkOrDelete() {
        setTimeout(() => {
            if (this.modified.getTime() + TIMEOUT <= Date.now) {
                this.map.delete(this.user.id);
                return;
            }
            this.checkOrDelete();
        }, 90000);
    }
}

const userManager = new UserManager();
export default userManager;