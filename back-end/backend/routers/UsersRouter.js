import fitmatch from "./../../api/Fitmatch.js";
import { tokenRequired } from "../../api/utils/Validate.js";
import express from "express";

const router = express.Router();

router.get("/", tokenRequired, (request, response, next) => {
    fitmatch.getSqlManager().getAllUsers()
    .then(e => response.json({
        status: true,
        data: e[0]
    }))
    .catch(err => {
        
    });
    
});

export default router;