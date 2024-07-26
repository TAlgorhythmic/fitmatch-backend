import fitmatch from "./api/Fitmatch.js";
import fs from "fs";

function run() {
    // App instance.
    
    // Read database schema + run script
    const sqlInit = fs.readFileSync("./schema.sql", { encoding: "utf8" });
    sqlInit.split("///").forEach(query => {
        fitmatch.sql.query(query);
    })

    
}

run();