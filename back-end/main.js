import fitmatch from "./api/Fitmatch.js";
import cors from "cors";
import fs from "fs";
import activitiesRouter from "./backend/routers/ActivitiesRouter.js";
import usersRouter from "./backend/routers/UsersRouter.js";
import authRouter from "./backend/routers/AuthRouter.js";
import e from "express";

let i = 0;

function executeQueriesRecursively(queries) {
    if (queries.length > 0) {
        fitmatch.sql.query(queries[i])
        .then(e => console.log("Success!"))
        .catch(e => console.log("An error ocurred trying to initialize the database schema. Error: " + err))
        .finally(e => {
            i++;
            if (i < queries.length) {
                executeQueriesRecursively(queries);
            }
        })
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
    

    //npm run build y luego se puede  app.use(express.static('FRONT/dist'));
    app.use(e.static("./../front/dist"));

    //arranque del servidor
    const port = 3001;
    const host = "localhost";
    app.listen(port, "localhost", () => console.log(`API listening on http://${host}:${port}!`));
}

run();