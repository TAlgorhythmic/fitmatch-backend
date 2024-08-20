-- Insertando 5 usuarios falsos en la tabla 'users'
INSERT INTO users (pwhash, provider, name, lastname, email, phone, description, proficiency, trainingPreferences, img, country, city, latitude, longitude, isSetup, tableVersion, monday, tuesday, wednesday, thursday, friday, saturday, sunday, timetable1, timetable2)
VALUES
-- Usuario 1
(123457, 'local', 'Alice', 'Smith', 'alice.smith@example.com', '123456789', 'Apasionada por el entrenamiento funcional y la vida saludable.', 'Avanzado', ';Bodybuilding;CrossFit;Yoga;Pilates', 'img1.jpg', 'Spain', 'Barcelona', '41.3873974', '2.168568', TRUE, 1, TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, TRUE, 480, 600);

