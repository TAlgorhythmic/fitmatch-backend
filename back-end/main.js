import fitmatch from "./api/Fitmatch.js";
import cors from "cors";
import fs from "fs";
import activitiesRouter from "./backend/routers/ActivitiesRouter.js";
import usersRouter from "./backend/routers/UsersRouter.js";

function run() {
    // App instance.

    // Read database schema + run script
    const sqlInit = fs.readFileSync("./schema.sql", { encoding: "utf8" });
    sqlInit.split("///").forEach(query => {
        fitmatch.sql.query(query);
    })

    const app = fitmatch.getServer();
    app.use(cors());


    //las rutas que empiecen por /api/alumnes se dirigirán a alumnesRouter
    app.use('/api/activities', activitiesRouter);
    app.use('/api/users', usersRouter);

    //npm run buil  y luego se puede  app.use(express.static('FRONT/dist'));

    //arranque del servidor
    const port = 3001
    app.listen(port, () => console.log(`API listening on port ${port}!`))

}

run();