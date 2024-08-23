package com.fitmatch.core;

public class ServerUser {

    public final int id;
    public String name, lastname, email, description, proficiency, img, city, country;
    public final String phone;
    public String trainingPreferences;
    public double latitude, longitude;
    public boolean isSetup;
    public boolean monday, tuesday, wednesday, thursday, friday, saturday, sunday;
    public int timetable1, timetable2;

    public ServerUser(int id, String name, String lastname, String email, String phone, String description, String proficiency, String trainingPreferences, String img, String city, double lat, double longitude, boolean isSetup, boolean monday, boolean tuesday, boolean wednesday, boolean thursday, boolean friday, boolean saturday, boolean sunday, int timetable1, int timetable2, String country) {
        this.id = id; this.name = name; this.lastname = lastname;
        this.trainingPreferences = trainingPreferences;
        this.email = email; this.phone = phone;
        this.description = description;
        this.proficiency = proficiency;
        this.img = img;
        this.city = city; this.latitude = lat; this.longitude = longitude; this.country = country;
        this.isSetup = isSetup;
        this.monday = monday; this.tuesday = tuesday; this.wednesday = wednesday; this.thursday = thursday; this.friday = friday; this.saturday = saturday; this.sunday = sunday;
        this.timetable1 = timetable1; this.timetable2 = timetable2;
    }

    public static ServerUser fromJson(String json) {
        return Fitmatch.getInstance().getGson().fromJson(json, ServerUser.class);
    }
}
