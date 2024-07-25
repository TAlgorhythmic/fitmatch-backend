import Server from "./api/Fitmatch.js";

function run() {
    // Això inicialitza tot, l'aplicació comença a api/Gymder.js
    
    const server = new Server();

    const app = server.getServer();

    //arranque del servidor
    const port = 3000
    app.listen(port, () => console.log(`API listening on port ${port}!`))
}

run();