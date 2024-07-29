-- Insertar datos en la tabla 'users'
INSERT INTO users (salt, pwhash, name, lastname, email, phone, description, proficiency, trainingPreferences, img, location, isSetup, tableVersion) VALUES
('123e4567-e89b-12d3-a456-426614174000', 123456, 'John', 'Doe', 'john.doe@example.com', '123-456-7890', 'Description for John Doe', 'Intermedio', 'Training preferences for John Doe', 'img1.jpg', 'New York, USA', TRUE, 1),
('223e4567-e89b-12d3-a456-426614174001', 654321, 'Jane', 'Smith', 'jane.smith@example.com', '321-654-0987', 'Description for Jane Smith', 'Avanzado', 'Training preferences for Jane Smith', 'img2.jpg', 'Los Angeles, USA', TRUE, 1),
('323e4567-e89b-12d3-a456-426614174002', 112233, 'Alice', 'Johnson', 'alice.johnson@example.com', '456-789-0123', 'Description for Alice Johnson', 'Principiante', 'Training preferences for Alice Johnson', 'img3.jpg', 'Chicago, USA', FALSE, 1),
('423e4567-e89b-12d3-a456-426614174003', 332211, 'Bob', 'Brown', 'bob.brown@example.com', '789-012-3456', 'Description for Bob Brown', 'Intermedio', 'Training preferences for Bob Brown', 'img4.jpg', 'Houston, USA', FALSE, 1),
('523e4567-e89b-12d3-a456-426614174004', 445566, 'Charlie', 'Davis', 'charlie.davis@example.com', '012-345-6789', 'Description for Charlie Davis', 'Avanzado', 'Training preferences for Charlie Davis', 'img5.jpg', 'Phoenix, USA', TRUE, 1);

-- Insertar datos en la tabla 'days_of_week'
INSERT INTO days_of_week (monday, tuesday, wednesday, thursday, friday, saturday, sunday, userId, timetable) VALUES
(TRUE, TRUE, TRUE, FALSE, FALSE, TRUE, FALSE, 1, '6:00-7:00'),
(FALSE, TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, 2, '7:00-8:00'),
(TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, FALSE, 3, '8:00-9:00'),
(TRUE, TRUE, FALSE, FALSE, TRUE, FALSE, TRUE, 4, '9:00-10:00'),
(FALSE, FALSE, TRUE, TRUE, TRUE, TRUE, FALSE, 5, '10:00-11:00');

-- Insertar datos en la tabla 'friends'
INSERT INTO friends (userId1, userId2) VALUES
(1, 2),
(1, 3),
(2, 4),
(2, 5),
(3, 5);

-- Insertar datos en la tabla 'activities'
INSERT INTO activities (title, description, postDate, expires, userId, tableVersion) VALUES
('Morning Yoga', 'A relaxing morning yoga session', '2024-07-01 08:00:00', '2024-07-31 08:00:00', 1, 1),
('Evening Run', 'Join us for an evening run in the park', '2024-07-02 18:00:00', '2024-08-02 18:00:00', 2, 1),
('Weekend Hike', 'Exploring the trails on a weekend hike', '2024-07-03 10:00:00', '2024-07-30 10:00:00', 3, 1),
('Swimming Session', 'Swimming session at the local pool', '2024-07-04 15:00:00', '2024-07-29 15:00:00', 4, 1),
('Cycling Event', 'Join us for a cycling event around the city', '2024-07-05 07:00:00', '2024-07-28 07:00:00', 5, 1);

-- Insertar datos en la tabla 'joins_activities'
INSERT INTO joins_activities (userId, postId) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(1, 2),
(2, 3),
(3, 4),
(4, 5),
(5, 1);
