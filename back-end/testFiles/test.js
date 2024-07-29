import fitmatch from "../api/Fitmatch.js";
import fs from "fs";

function run() {
    
    let i = 0;
    function executeQueriesRecursively(queries) {
        if (queries.length > 0) {
            fitmatch.sql.query(queries[i])
            .then(e => console.log("Success!"))
            .catch(err => console.log("An error ocurred trying to initialize the database schema. Error: " + err))
            .finally(e => {
                i++;
                if (i < queries.length) {
                    executeQueriesRecursively(queries);
                }
            })
        }
    }

    const sqlInit = fs.readFileSync("./testFiles/testusers.sql", { encoding: "utf8" });
    const split = sqlInit.split("///");
    
    executeQueriesRecursively(split);
}

run();