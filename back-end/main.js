import fitmatch from "./api/Fitmatch.js";
import cors from "cors";
import fs from "fs";
import activitiesRouter from "./routers/ActivitiesRouter.js";
import usersRouter from "./routers/UsersRouter.js";
import authRouter from "./routers/AuthRouter.js";
import joinedActivitiesRouter from "./routers/JoinedActivitiesRouter.js";
import requestRouter from "./routers/RequestsRouter.js";
import credentialsRouter from "./routers/CredentialsRouter.js";
import e from "express";
import { removeGarbage } from "./api/management/SQLManager.js";
let i = 0;
function executeQueriesRecursively(queries) {
    if (queries.length > 0) {

        fitmatch.sql.query(queries[i])
        .then(e => console.log("Success!"))
        .catch(err => {
            console.log("Your SQL schema is wrong. Check schema.sql. Error: " + err)
        })
        .finally(e => {
            i++;
            if (i < queries.length) {
                executeQueriesRecursively(queries);
            }
        });
    }
}

function run() {
    // Read database schema + run script
    const sqlInit = fs.readFileSync("./schema.sql", { encoding: "utf8" });
    const split = sqlInit.split("///");

    executeQueriesRecursively(split);

    const app = fitmatch.getServer();
    app.use(cors());


    //las rutas que empiecen por /api/alumnes se dirigirán a alumnesRouter
    app.use("/api/auth", authRouter);
    app.use('/api/activities', activitiesRouter);
    app.use('/api/users', usersRouter);
    app.use('/api/joinedactivities', joinedActivitiesRouter);
    app.use('/api/requests', requestRouter);
    app.use("/api/credentials", credentialsRouter);

    //npm run build y luego se puede  app.use(express.static('FRONT/dist'));
    app.use(e.static("../front/dist"));

    removeGarbage(60000);

    //arranque del servidor
    const port = 3001;
    const host = "localhost";
    app.listen(port, "localhost", () => console.log(`API listening on http://${host}:${port}!`));
}

run();