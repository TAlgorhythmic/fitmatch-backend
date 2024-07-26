import { QueryTypes } from "sequelize";
import Fitmatch from "./api/Fitmatch.js";
import fs from "fs";

function run() {
    // App instance.
    const instance = new Fitmatch();
    
    // Read database schema + run script
    const sqlInit = fs.readFileSync("./schema.sql", { encoding: "utf8" });
    sqlInit.split("///").forEach(query => {
        instance.sql.query(query);
    })
}

run();