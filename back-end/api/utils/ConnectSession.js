import { sketchyOrder } from "../../routers/UsersRouter.js";
import { buildInternalErrorPacket, buildInvalidPacket, buildSendDataPacket } from "../packets/PacketBuilder.js";
import User from "../User.js";
import fitmatch from "./../Fitmatch.js";
import { areCompatible } from './Algorithms.js';

const USERS_PER_REQUEST = 15;
const TIMEOUT = 360000;

export const sessions = new Map();

class ConnectSession {
    constructor(id) {
        this.id = id;
        this.position = 0;
        this.rejects = [];
        this.postRejects(20000);
        this.isCancelled = false;
        this.modified = new Date();
        this.user = fitmatch.getUserManager().containsKey(this.id) ? fitmatch.userManager.get(this.id).user : undefined;
        if (!this.user) {
            fitmatch.sqlManager.getUserFromId(this.id)
            .then(e => {
                const data = e;
                const user = new User(data.id, data.name, data.lastname, data.email, data.phone, data.description, data.proficiency, data.trainingPreferences, data.img, data.city, data.latitude, data.longitude, data.isSetup, data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday, data.sunday, data.timetable1, data.timetable2);
                fitmatch.userManager.put(user.id, user);
                this.user = user;
            })
            .catch(err => {
                console.log(err);
                console.warn("Fatal error warning! User did not exist and could not fetch it. Possible crash incoming.")
            })
        }
    }

    sendMore(response) {
        this.modified = new Date();
        this.position += USERS_PER_REQUEST;

        fitmatch.sqlManager.getAllUsersWithLimitOffset(USERS_PER_REQUEST, this.position - USERS_PER_REQUEST)
            .then(e => {
                if (this.isCancelled) {
                    response.json(buildInvalidPacket())
                } else {
                    const listUsersData = e;

                    if (!listUsersData) return null;

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