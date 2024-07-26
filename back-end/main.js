import Fitmatch from "./api/Fitmatch.js";
import fs from "fs";

function run() {
    
    const instance = new Fitmatch();
    
    const sqlInit = fs.readFileSync("./schema.sql", { encoding: "utf8" });
    sqlInit.split("///").forEach(query => {
        instance.sql.query(query);
    })
}

run();