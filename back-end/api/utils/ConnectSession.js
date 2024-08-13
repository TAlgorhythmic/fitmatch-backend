import { sketchyOrder } from "../../routers/UsersRouter.js";
import { buildInternalErrorPacket, buildInvalidPacket, buildSendDataPacket } from "../packets/PacketBuilder.js";
import User from "../User.js";
import fitmatch from "./../Fitmatch.js";
import { areCompatible } from './Algorithms.js';
import { sanitizeDataReceivedForArrayOfObjects } from "./Sanitizers.js";

const USERS_PER_REQUEST = 15;
const TIMEOUT = 360000;

export const sessions = new Map();

class ConnectSession {
    constructor(user) {
        this.id = user.id;
        this.position = 0;
        this.rejects = [];
        this.postRejects(20000);
        this.isCancelled = false;
        this.modified = new Date();
        this.temp;
        this.user = user;
    }

    sendMore(response) {
        this.modified = new Date();
        this.position += USERS_PER_REQUEST;

        fitmatch.sqlManager.getAllUsersWithLimitOffset(USERS_PER_REQUEST, this.position - USERS_PER_REQUEST)
            .then(e => {
                if (this.isCancelled) {
                    response.json(buildInvalidPacket());
                } else {
                    const listUsersData = sanitizeDataReceivedForArrayOfObjects(e, "id").map(item => new User(item.id, item.name, item.lastname, item.email, item.phone, item.description, item.proficiency, item.trainingPreferences, item.img, item.city, item.latitude, item.longitude, item.isSetup, item.monday, item.tuesday, item.wednesday, item.thursday, item.friday, item.saturday, item.sunday, item.timetable1, item.timetable2));

                    if (!listUsersData.length) return null;

                    listUsersData.forEach(user => {
                        user.matchPercent = areCompatible(this.user, user);
                    });

                    const sketchyOrdered = sketchyOrder(listUsersData);
                    response.json(buildSendDataPacket(sketchyOrdered));
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

    async postRejects(millis) {
        setTimeout(async () => {
            try {
                this.rejects.forEach(reject => {
                    fitmatch.sqlManager.putRejection(this.user.id, reject)
                        .then(e => {
                            console.log("Rejects updated for " + this.user.email);
                            console.log("Output: " + e[0]);
                        })
                        .catch(error => {
                            console.log(error);
                        })
                        .finally(() => {
                            this.isCancelled = (this.modified.getTime() + TIMEOUT) <= Date.now();
                            if (!this.isCancelled) {
                                this.postRejects(millis);
                            } else {
                                sessions.delete(this.user.id);
                            }
                        })
                });
            } catch (err) {
                console.log(err);
            }
        }, millis);
    }
}

export default ConnectSession;