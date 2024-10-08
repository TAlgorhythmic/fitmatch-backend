import { sketchyOrder } from "../../routers/UsersRouter.js";
import { buildInternalErrorPacket, buildInvalidPacket, buildNoDataFoundPacket, buildSendDataPacket } from "../packets/PacketBuilder.js";
import User from "../User.js";
import fitmatch from "./../Fitmatch.js";
import { areCompatible } from './Algorithms.js';
import { sanitizeDataReceivedForArrayOfObjects } from "./Sanitizers.js";

const USERS_PER_REQUEST = 15;
const TIMEOUT = 360000;

export const sessions = new Map();

class ConnectSession {
    constructor(user) {
        if (!user || !user.id) throw new Error("User cannot be undefined.");
        this.id = user.id;
        this.position = 0;
        this.isCancelled = false;
        this.modified = new Date();
        this.user = user;
        this.attempt = 0;
    }

    filterUsers(array, ignore) {
        return array.filter(item => {
            if (!item || item.id === this.id || ignore.has(item.id)) return false;
            return true;
        });
    }

    sendMore(response) {
        if (this.attempt > 1) {
            console.log("No data found for " + this.user.name + ". Aborting...");
            response.json(buildNoDataFoundPacket());
            this.attempt = 0;
            return;
        }
        this.modified = new Date();
        this.position += USERS_PER_REQUEST;

        fitmatch.sqlManager.getAllUsersWithLimitOffset(USERS_PER_REQUEST, this.position - USERS_PER_REQUEST)
            .then(e => {
                if (this.isCancelled) {
                    response.json(buildInvalidPacket("This session is closed."));
                } else {
                    const listUsersData = sanitizeDataReceivedForArrayOfObjects(e, "id").map(item => new User(item.id, item.name, item.lastname, item.email, item.phone, item.description, item.proficiency, item.trainingPreferences, item.img, item.city, item.latitude, item.longitude, item.isSetup, item.monday, item.tuesday, item.wednesday, item.thursday, item.friday, item.saturday, item.sunday, item.timetable1, item.timetable2, item.country, item.isVerified));

                    if (!listUsersData.length) return null;

                    fitmatch.sqlManager.getRejectionsById(this.id).then(e1 => {
                        const rejectionsData = sanitizeDataReceivedForArrayOfObjects(e1, "friendId");
                        fitmatch.sqlManager.getFriendsById(this.id).then(e2 => {
                            const friendsData = sanitizeDataReceivedForArrayOfObjects(e2, "friendId");
                            fitmatch.sqlManager.getPendingsById(this.id).then(e3 => {
                                const pendingsData = sanitizeDataReceivedForArrayOfObjects(e3, "pendingId");

                                const ignoreSet = new Set();
                                rejectionsData.forEach(it => ignoreSet.add(it.friendId));
                                friendsData.forEach(it => ignoreSet.add(it.friendId));
                                pendingsData.forEach(it => ignoreSet.add(it.pendingId));

                                const filtered = this.filterUsers(listUsersData, ignoreSet);

                                if (!filtered.length) return null;

                                filtered.forEach(user => {
                                    user.matchPercent = areCompatible(this.user, user);
                                });

                                const sketchyOrdered = sketchyOrder(filtered);

                                response.json(buildSendDataPacket(sketchyOrdered));
                                this.attempt = 0;
                            })
                            .then(e => {
                                if (e === null) {
                                    this.attempt++;
                                    this.sendMore(response);
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                response.json(buildInternalErrorPacket("Backend internal error. Check logs."));
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            response.json(buildInternalErrorPacket("Backend internal error. Check logs."));
                        })
                    }).catch(err => {
                        console.log(err);
                        response.json(buildInternalErrorPacket("Backend internal error. Check logs."));
                    })
                }
            })
            .then(e => {
                if (e === null) {
                    this.position = 0;
                    this.sendMore(response);
                }
            })
            .catch(err => {
                console.log(err);
                response.json(buildInternalErrorPacket(err));
            });
    }
}

export default ConnectSession;