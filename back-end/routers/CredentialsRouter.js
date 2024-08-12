import { buildSendDataPacket } from "../api/packets/PacketBuilder.js";
import { tokenRequired } from "../api/utils/Validate.js";
import fitmatch from "./../api/Fitmatch.js";
import express from "express";

const router = express.Router();

router.get("/mapskey", tokenRequired, (req, res, next) => {
    res.json(buildSendDataPacket(fitmatch.config.mapsApiKey));
})

export default router;