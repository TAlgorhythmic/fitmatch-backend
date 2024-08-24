import f from "./Fitmatch.js";
import twilio from "twilio";

const sid = f.getConfig().twilio_sid;
const token = f.getConfig().twilio_token;

const client = twilio(sid, token);

class Twilio {
    constructor(client, sid, token) {
        this.client = client;
        this.sid = sid;
        this.token = token;
        this.pendingVerifications = new Map();
    }

    async createCode(phone) {
        try {
            await client.verify.v2
            .services(this.sid)
            .verifications.create({
                channel: "sms",
                to: phone
            });
            return true;
        } catch (err) {
            console.log(err);
        }
        return false;
    }
    async verifyCode(phone, code) {
        const verify = await client.verify.v2
            .services(this.sid)
            .verificationChecks.create({to: phone, code: code});
        if (verify.status === "approved") {
            return true;
        }
        return false;
    }
}

const twl = new Twilio(client, sid, token);

export default twl;