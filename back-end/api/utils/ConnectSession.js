import { buildInternalErrorPacket, buildInvalidPacket } from "../packets/PacketBuilder.js";
import fitmatch from "./../Fitmatch.js";
import {areCompatible} from './Algoritms.js';

const USERS_PER_REQUEST = 15;
const TIMEOUT = 360000;

export const sessions = new Map();

class ConnectSession {
    constructor(user) {
        this.user = user;
        this.position = 0;
        this.rejects = [];
        this.postRejects(20000);
        this.isCancelled = false;
        this.modified = new Date();
    }

    sendMore(response) {
        this.modified = new Date();
        this.position += USERS_PER_REQUEST;

        fitmatch.sqlManager.getAllUsersWithLimitOffset(USERS_PER_REQUEST, this.position - USERS_PER_REQUEST)
            .then(e => {
                if (this.isCancelled) {
                    response.json(buildInvalidPacket())
                } else {
                    const listUsersData = json(e[0]);
                    listUsersData.forEach(user => {
                        user.matchPercent = areCompatible(this.user,user);
                    });

                    listUsersData.sort((a, b) => {
                        return b.matchPercent - a.matchPercent;
                    });

                    response.json({
                        ok: true,
                        data: listUsersData
                    });
                }
            })
            .catch(err => {
                response.json(buildInternalErrorPacket(err));
            });
    }

    async postRejects(millis) {
        new Promise(setTimeout(() => {
            this.rejects.forEach(reject => {
                fitmatch.sqlManager.putRejection(this.user, reject)
                    .then(e => {
                        console.log("Rejects updated for " + this.user.email);
                        console.log("Output: " + e[0]);
                    })
                    .catch(error => {
                        console.log(error);
                    })
            })
        }, millis))
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.isCancelled = (this.modified.getTime() + TIMEOUT) <= Date.now;
                if (!this.isCancelled) {
                    this.postRejects(millis);
                } else {
                    sessions.delete(this.user.id);
                }
            });
    }
}

export default ConnectSession;