// TODO implement automatic memory management.
class UserManager {
    constructor() {
        this.map = new Map();
    }

    put(id, user) {
        this.map.set(id, user);
    }

    containsKey(id) {
        return this.map.has(id);
    }

    get(id) {
        return this.map.get(id);
    }
}

const userManager = new UserManager();
export default userManager;