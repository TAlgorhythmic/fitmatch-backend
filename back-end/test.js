import fitmatch from "./api/Fitmatch.js";

function run() {
    

    fitmatch.getServer().get("/", (req, res) => {
        fitmatch.sql.query("SELECT * FROM users;")
        .then(e => res.json({ok: true, data: e[0]}))
        .catch(err => {console.log(err)});
    });
    fitmatch.getServer().get("/xd", (req, res) => {
        fitmatch.sql.query("INSERT INTO users(salt, pwhash, name, email, trainingPreferences) VALUES('asad', 1234, 'inti', 'intivioli@gmail.com', 'test');")
        .then(e => res.json({ok: true, data: e[0]}))
        .catch(err => {console.log(err)});
    });
    fitmatch.getServer().listen(3000, "localhost", {});
}

run();