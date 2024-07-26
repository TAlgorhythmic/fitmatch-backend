CREATE TABLE IF NOT EXISTS passwds(
    id INT NOT NULL AUTO_INCREMENT,
    salt CHAR(36) NOT NULL,
    pwhash INT NOT NULL,
    userId INT NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id),
    PRIMARY KEY(id)
);
CREATE TABLE IF NOT EXISTS users(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(32),
    lastname VARCHAR(36),
    email VARCHAR(40) NOT NULL,
    phone VARCHAR(20),
    dni VARCHAR(40),
    PRIMARY KEY(id)
);
CREATE TABLE IF NOT EXISTS posts(
    id INT 
    title VARCHAR()
)