import activitiesManager from "../management/ActivitiesManager.js";
import sqlManager from "../management/SQLManager.js";

const ACTIVITIES_PER_REQUEST = 10;

export const feedSessions = new Map();

class FeedSession {
    constructor(user, friendsSet, excludeSet) {
        if (!user || !user.id) throw new Error("User cannot be undefined.");
        this.id = user.id;
        this.position = 0;
        this.modified = new Date();
        this.user = user;
        // Fix this.
        this.isEnded = false;
        this.array = [];
        [...activitiesManager.map.values()].forEach(ref => this.array.push(ref.activity));
        this.array = sqlManager.filterActivities([...this.array].filter(item => friendsSet.has(item.userId) && item.userId !== user.id && !excludeSet.has(item.id)));
        this.array.sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);

            return dateA.getTime() - dateB.getTime();
        });
    }

    getMore() {
        if (this.isEnded) return [];
        this.modified = new Date();
        this.position += ACTIVITIES_PER_REQUEST;

        const sendData = this.array.slice(this.position - ACTIVITIES_PER_REQUEST, ACTIVITIES_PER_REQUEST);

        if (this.position >= this.array.length) this.isEnded = true;

        console.log(this.array);

        return sendData;
    }
}

export default FeedSession;