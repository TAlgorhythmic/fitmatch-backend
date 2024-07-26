import Fitmatch from "./api/Fitmatch.js";

function run() {
    // Això inicialitza tot, l'aplicació comença a api/Gymder.js
    const instance = new Fitmatch();

    const app = instance.getServer();

    //arranque del servidor
    const port = 3000
    app.listen(port, () => console.log(`API listening on port ${port}!`))
}

run();