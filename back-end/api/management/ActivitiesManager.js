import Activity from "../Activity.js";
import { sanitizeDataReceivedForArrayOfObjects } from "../utils/Sanitizers.js";
import sqlManager from "./SQLManager.js";

/**
 * Important! Use setters for updating values.
 */
class ActivitiesManager {
    constructor() {
        this.map = new Map();
        this.loadTemp = 0;
    }

    put(id, activity) {
        const ref = new Ref(activity, this.map);
        this.map.set(id, ref);
    }

    containsKey(id) {
        return this.map.has(id);
    }

    get(id) {
        const ref = this.map.get(id);
        return ref;
    }

    init() {
        sqlManager.getAllActivities()
        .then(e => {
            const data = sanitizeDataReceivedForArrayOfObjects(e, "id");
            data.forEach(item => this.map.set(item.id, new Activity(item.id, item.title, item.description, item.postDate, item.expires, item.userId, item.placeholder, item.latitude, item.longitude)));
            console.log("Activities initialized!");
        }).catch(err => {
            console.log("Failed to initialize activities: " + err);
            process.exit(-1);
        })
    }
}

class Ref {
    constructor(activity, map) {
        this.activity = activity;
        this.map = map;
        this.saveList = new Map();
        this.periodicallySave();
    }

    onModify(field, value) {
        this.saveList.set(field, value);
    }

    periodicallySave() {
        setTimeout(() => {
            this.save();
            if (this.map.has(this.activity.id)) {
                this.periodicallySave();
            } else return;
        }, 20000);
    }

    save() {
        if (this.saveList.size) {
            sqlManager.selectivelyUpdateActivity(this.activity, this.saveList)
            .then(e => {
                this.saveList.clear();
            }).catch(err => {
                console.log(err);
            });
        }
    }
}

const activitiesManager = new ActivitiesManager();
export default activitiesManager;