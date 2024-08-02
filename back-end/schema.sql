-- Independent table
CREATE TABLE IF NOT EXISTS users(
    id INT NOT NULL AUTO_INCREMENT,
    pwhash VARCHAR(400) NOT NULL,
    name VARCHAR(32) NOT NULL,
    lastname VARCHAR(36),
    email VARCHAR(40),
    phone VARCHAR(20) NOT NULL,
    description VARCHAR(250),
    proficiency ENUM("Principiante", "Intermedio", "Avanzado"),
    trainingPreferences VARCHAR(300),
    img VARCHAR(60) NOT NULL DEFAULT "img1.jpg",
    city VARCHAR(45),
    latitude VARCHAR(50),
    longitude VARCHAR(50),
    isSetup BOOLEAN NOT NULL DEFAULT FALSE,
    tableVersion INT NOT NULL DEFAULT 0,
    PRIMARY KEY(id)
);
///
CREATE TABLE IF NOT EXISTS days_of_week(
    id INT NOT NULL AUTO_INCREMENT,
    monday BOOLEAN NOT NULL,
    tuesday BOOLEAN NOT NULL,
    wednesday BOOLEAN NOT NULL,
    thursday BOOLEAN NOT NULL,
    friday BOOLEAN NOT NULL,
    saturday BOOLEAN NOT NULL,
    sunday BOOLEAN NOT NULL,
    userId INT NOT NULL,
    timetable ENUM("6:00-7:00","7:00-8:00", "8:00-9:00", "9:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00", "18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00", "22:00-23:00"),
    FOREIGN KEY(userId) REFERENCES users(id),
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