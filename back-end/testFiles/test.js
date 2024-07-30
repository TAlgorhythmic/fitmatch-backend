import fitmatch from "../api/Fitmatch.js";
import fs from "fs";
import bcrypt from "bcrypt";
import { isValidPassword } from "../api/utils/Validate.js";
import { areCompatible } from "../api/utils/Algoritms.js";
import User from "../api/User.js";

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

function testAlgorithm() {
    fitmatch.getSqlManager().getAllUsers()
    .then(e => {
        const data = e[0];
        data.forEach(item => {
            data.forEach(item2 => {
                const user1 = new User(item.id, item.name, item.lastname, item.email, item.phone, item.description, item.proficiency, item.trainingPreferences, item.img, item.location, item.isSetup);
                const user2 = new User(item2.id, item2.name, item2.lastname, item2.email, item2.phone, item2.description, item2.proficiency, item2.trainingPreferences, item2.img, item2.location, item2.isSetup);
                console.log(`${user1.name} ${user1.lastname} ~ ${user2.name} ${user2.lastname} ==> ${areCompatible(user1, user2)}`);
            })
        })
    })
}
// test1();
// createTestUsers();
testAlgorithm();