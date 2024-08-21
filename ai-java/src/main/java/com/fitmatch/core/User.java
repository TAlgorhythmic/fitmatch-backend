package com.fitmatch.core;

import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class User {

    private static final Map<Integer, User> users = new ConcurrentHashMap<>();
    private static User[] inMemoryInitialUsers;

    public static void loadUsers() {
        try (final InputStreamReader reader = new InputStreamReader(User.class.getClassLoader().getResourceAsStream("bots.json"))) {
            inMemoryInitialUsers = Fitmatch.getInstance().getGson().fromJson(reader, User[].class);
        } catch (Throwable e) {
            e.printStackTrace();
            System.exit(-1);
        }
    }

    private int id;
    private String name, lastname, email, description, proficiency, img, city, country;
    private final String phone;
    private String[] trainingPreferences;
    private double latitude, longitude;
    private boolean isSetup;
    private boolean monday, tuesday, wednesday, thursday, friday, saturday, sunday;
    private int timetable1, timetable2;
    private final String password;
    private String token = null;

    public User(String name, String lastname, String email, String phone, String password, String description, String proficiency, String[] trainingPreferences, String img, String city, double lat, double longitude, boolean isSetup, boolean monday, boolean tuesday, boolean wednesday, boolean thursday, boolean friday, boolean saturday, boolean sunday, int timetable1, int timetable2, String country) {
        this.name = name; this.lastname = lastname;
        this.trainingPreferences = trainingPreferences;
        this.email = email; this.phone = phone;
        this.description = description;
        this.proficiency = proficiency;
        this.img = img;
        this.city = city; this.latitude = lat; this.longitude = longitude; this.country = country;
        this.isSetup = isSetup;
        this.monday = monday; this.tuesday = tuesday; this.wednesday = wednesday; this.thursday = thursday; this.friday = friday; this.saturday = saturday; this.sunday = sunday;
        this.timetable1 = timetable1; this.timetable2 = timetable2;
        this.password = password;
    }

    public void fetchToken() {
        // TODO
    }
}
