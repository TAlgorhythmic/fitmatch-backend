import activitiesManager from "../management/ActivitiesManager.js";
import { buildInternalErrorPacket, buildInvalidPacket, buildNoDataFoundPacket, buildSendDataPacket } from "../packets/PacketBuilder.js";
import User from "../User.js";
import fitmatch from "./../Fitmatch.js";
import { areCompatible } from './Algorithms.js';
import { sanitizeDataReceivedForArrayOfObjects } from "./Sanitizers.js";

const ACTIVITIES_PER_REQUEST = 10;

export const feedSessions = new Map();

class FeedSession {
    constructor(user, friendsSet) {
        if (!user || !user.id) throw new Error("User cannot be undefined.");
        this.id = user.id;
        this.position = 0;
        this.modified = new Date();
        this.activity = activity;
        this.isEnded = false;
        this.array = [...activitiesManager.map.values()].filter(item => friendsSet.has(item.userId));
    }

    filterActivities(array, ignore) {
        return array.filter(item => {
            if (!item || item.id === this.id || ignore.has(item.id)) return false;
            return true;
        });
    }

    getMore() {
        if (this.isEnded) return [];
        this.modified = new Date();
        this.position += ACTIVITIES_PER_REQUEST;

        const sendData = this.array.slice(this.position - ACTIVITIES_PER_REQUEST, ACTIVITIES_PER_REQUEST);

        if (this.position >= this.array.length) this.isEnded = true;

        return sendData;
    }
}

export default FeedSession;