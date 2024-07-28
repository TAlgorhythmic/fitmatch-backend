import fitmatch from "./../../api/Fitmatch.js";
import express from "express";

const router = express.Router();

router.get("/", (request, response, next) => {
    fitmatch.getSql().query("SELECT * FROM users;")
    .then(e => response.json({
        ok: true,
        data: e
    }))
    .catch(err => {

    });
    
});

export default router;