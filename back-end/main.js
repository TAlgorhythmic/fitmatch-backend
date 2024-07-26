import Fitmatch from "./api/Fitmatch.js";
import fs from "fs";

function run() {
    // Això inicialitza tot, l'aplicació comença a api/Gymder.js
    const instance = new Fitmatch();
    
    const sqlInit = fs.readFileSync("./schema.sql", { encoding: "utf8" });
    instance.sql.query(sqlInit);
}

run();