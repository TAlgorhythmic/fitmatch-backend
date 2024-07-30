import fitmatch from "../api/Fitmatch.js";
import fs from "fs";
import bcrypt from "bcrypt";
import { isValidPassword } from "../api/utils/Validate.js";

function createTestUsers() {
    
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

function test1() {
    const testPassword = "adsadsADad_12";
    if (isValidPassword(testPassword)) {
        console.log("Password vàlida.");
    } else {
        console.log("Password invalid.");
    }
    const hash = bcrypt.hashSync(testPassword, 10);
    console.log(hash);
    console.log(bcrypt.compareSync(testPassword, hash));
}
test1();