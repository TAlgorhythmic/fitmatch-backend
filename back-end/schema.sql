-- Independent table
CREATE TABLE IF NOT EXISTS users(
    id INT NOT NULL AUTO_INCREMENT,
    pwhash VARCHAR(400),
    provider ENUM("local", "google"),
    name VARCHAR(32) NOT NULL,
    lastname VARCHAR(36),
    email VARCHAR(40),
    phone VARCHAR(20) NOT NULL,
    description VARCHAR(250),
    proficiency ENUM("Principiante", "Intermedio", "Avanzado"),
    trainingPreferences VARCHAR(300),
    img VARCHAR(60) NOT NULL DEFAULT "img1.jpg",
    country VARCHAR(60),
    city VARCHAR(45),
    latitude VARCHAR(50),
    longitude VARCHAR(50),
    isSetup BOOLEAN NOT NULL DEFAULT FALSE,
    tableVersion INT NOT NULL DEFAULT 0,
    monday BOOLEAN NOT NULL DEFAULT FALSE,
    tuesday BOOLEAN NOT NULL DEFAULT FALSE,
    wednesday BOOLEAN NOT NULL DEFAULT FALSE,
    thursday BOOLEAN NOT NULL DEFAULT FALSE,
    friday BOOLEAN NOT NULL DEFAULT FALSE,
    saturday BOOLEAN NOT NULL DEFAULT FALSE,
    sunday BOOLEAN NOT NULL DEFAULT FALSE,
    timetable1 INT,
    timetable2 INT,
    isVerified BOOLEAN NOT NULL,
    PRIMARY KEY(id)
);
///
-- Relational table for friends handling. users to users, N to M.
CREATE TABLE IF NOT EXISTS friends(
    userId1 INT NOT NULL,
    userId2 INT NOT NULL,
    PRIMARY KEY(userId1, userId2),
    FOREIGN KEY(userId1) REFERENCES users(id),
    FOREIGN KEY(userId2) REFERENCES users(id)
);

-- Table for pending friend requests.
///
CREATE TABLE IF NOT EXISTS pending(
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    PRIMARY KEY(sender_id, receiver_id),
    FOREIGN KEY(sender_id) REFERENCES users(id),
    FOREIGN KEY(receiver_id) REFERENCES users(id)
);
///
CREATE TABLE IF NOT EXISTS rejects(
    issuer INT NOT NULL,
    rejected INT NOT NULL,
    expires DATE NOT NULL,
    PRIMARY KEY(issuer, rejected),
    FOREIGN KEY(issuer) REFERENCES users(id),
    FOREIGN KEY(rejected) REFERENCES users(id)
);
///
-- Trigger to avoid logic duplicates.

CREATE TRIGGER IF NOT EXISTS friends_insert_listener
BEFORE INSERT ON friends
FOR EACH ROW
BEGIN
    DECLARE tmp INT;
    IF NEW.userId1 > NEW.userId2 THEN
        SET tmp = NEW.userId1;
        SET NEW.userId1 = NEW.userId2;
        SET NEW.userId2 = tmp;
    END IF;
END;
///
-- Independent table, 1 to m relation with users, plus another relation n to m for activity joins
CREATE TABLE IF NOT EXISTS activities(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(40) NOT NULL,
    description VARCHAR(250),
    postDate TIMESTAMP NOT NULL,
    expires DATETIME NOT NULL,
    userId INT NOT NULL,
    placeholder VARCHAR(60) NOT NULL,
    latitude VARCHAR(50) NOT NULL,
    longitude VARCHAR(50) NOT NULL,
    tableVersion INT NOT NULL DEFAULT 0,
    FOREIGN KEY(userId) REFERENCES users(id),
    PRIMARY KEY(id)
);
///
-- Relational table to handle activity joins, posts to users, n to m.
CREATE TABLE IF NOT EXISTS joins_activities(
    userId INT NOT NULL,
    postId INT NOT NULL,
    PRIMARY KEY(userId, postId),
    FOREIGN KEY(userId) REFERENCES users(id),
    FOREIGN KEY(postId) REFERENCES activities(id)
);