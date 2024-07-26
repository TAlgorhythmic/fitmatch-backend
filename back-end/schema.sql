-- Independent table
CREATE TABLE IF NOT EXISTS users(
    id INT NOT NULL AUTO_INCREMENT,
    salt CHAR(36) NOT NULL,
    pwhash INT NOT NULL,
    name VARCHAR(32),
    lastname VARCHAR(36),
    email VARCHAR(40) NOT NULL,
    phone VARCHAR(20),
    description VARCHAR(250),
    schedules VARCHAR(40),
    proficiency INT,
    trainingPreferences VARCHAR(500),
    tableVersion INT NOT NULL DEFAULT 0,
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
///
-- Trigger to avoid logic duplicates.
CREATE TRIGGER IF NOT EXISTS friends_insert_listener
BEFORE INSERT ON friends
FOR EACH ROW
BEGIN
    IF NEW.userId1 > NEW.userId2 THEN
        SET @tmp = NEW.userId1;
        SET NEW.userId1 = NEW.userId2;
        SET NEW.userId2 = @tmp;
    END IF;
END;
///
-- Independent table, 1 to m relation with users, plus another relation n to m for activity joins
CREATE TABLE IF NOT EXISTS posts(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(40) NOT NULL,
    description VARCHAR(250),
    postDate DATE NOT NULL,
    expires DATE NOT NULL,
    userId INT NOT NULL,
    tableVersion INT NOT NULL DEFAULT 0,
    PRIMARY KEY(id)
);
///
-- Relational table to handle activity joins, posts to users, n to m.
CREATE TABLE IF NOT EXISTS joins_posts(
    userId INT NOT NULL,
    postId INT NOT NULL,
    PRIMARY KEY(userId, postId),
    FOREIGN KEY(userId) REFERENCES users(id),
    FOREIGN KEY(postId) REFERENCES posts(id)
);