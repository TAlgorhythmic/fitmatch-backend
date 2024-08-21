package com.fitmatch.core;

public class User {

    private final int id;
    private String name, lastname, email, description, proficiency, img, city, country;
    private final String phone;
    private String trainingPreferences;
    private double latitude, longitude;
    private boolean isSetup;
    private boolean monday, tuesday, wednesday, thursday, friday, saturday, sunday;
    private int timetable1, timetable2;

    public User(int id, String name, String lastname, String email, String phone, String description, String proficiency, String trainingPreferences, String img, String city, double lat, double longitude, boolean isSetup, boolean monday, boolean tuesday, boolean wednesday, boolean thursday, boolean friday, boolean saturday, boolean sunday, int timetable1, int timetable2, String country) {
        this.id = id;
        this.name = name;
        this.trainingPreferences = trainingPreferences;
        this.lastname = lastname;
        this.email = email;
        this.phone = phone;
        this.description = description;
        this.proficiency = proficiency;
        this.img = img;
        this.city = city;
        this.latitude = lat;
        this.longitude = longitude;
        this.isSetup = isSetup;
        this.monday = monday;
        this.tuesday = tuesday;
        this.wednesday = wednesday;
        this.thursday = thursday;
        this.friday = friday;
        this.saturday = saturday;
        this.sunday = sunday;
        this.timetable1 = timetable1;
        this.timetable2 = timetable2;
        this.country = country;
    }
}
