package com.fitmatch.core;

import java.io.InputStreamReader;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import com.fitmatch.core.fetch.controllers.Packets;
import com.fitmatch.core.fetch.controllers.Packets.Out.PacketSetup;;;

public class User {

    public static User[] loadUsers() {
        try (final InputStreamReader reader = new InputStreamReader(User.class.getClassLoader().getResourceAsStream("bots.json"))) {
            User[] inMemoryInitialUsers = Fitmatch.getInstance().getGson().fromJson(reader, User[].class);
            return inMemoryInitialUsers;
        } catch (Throwable e) {
            e.printStackTrace();
            System.exit(-1);
        }
        return null;
    }

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

    public boolean isSetup() {
        return isSetup;
    }

    public boolean isMonday() {
        return monday;
    }

    public boolean isTuesday() {
        return tuesday;
    }

    public boolean isWednesday() {
        return wednesday;
    }

    public boolean isThursday() {
        return thursday;
    }

    public boolean isFriday() {
        return friday;
    }

    public boolean isSaturday() {
        return saturday;
    }

    public boolean isSunday() {
        return sunday;
    }

    public void fetchToken(boolean startAfterwards) {
        Packets.In.PacketInToken token = Fitmatch.getInstance().getClient().authController.login(new Packets.Out.PacketLogin(phone, password));
        if (token == null) {
            System.out.println("Login for " + this.email + " failed. Trying to register...");
        } else {
            token = Fitmatch.getInstance().getClient().authController.register(new Packets.Out.PacketRegister(phone, name, password));
            if (token == null) {
                System.out.println("Failed to register " + email + ". Aborted.");
                return;
            }
            this.token = token.token;
            boolean setup = Fitmatch.getInstance().getClient().usersController.setup(new PacketSetup(this), this.token);
            if (!setup) {
                System.out.println(email + " registered but failed to setup.");
                return;
            }
            System.out.println(email + " registered successfully!");
            if (startAfterwards) startScheduling();
        }
    }

    public void startScheduling() {
        // TODO
    }

    public String getCity() {
        return city;
    }

    public String getCountry() {
        return country;
    }

    public String getDescription() {
        return description;
    }

    public String getEmail() {
        return email;
    }

    public String getImg() {
        return img;
    }

    public String getLastname() {
        return lastname;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public String getName() {
        return name;
    }

    public String getPassword() {
        return password;
    }

    public String getPhone() {
        return phone;
    }

    public String getProficiency() {
        return proficiency;
    }

    public int getTimetable1() {
        return timetable1;
    }

    public int getTimetable2() {
        return timetable2;
    }

    public String getToken() {
        return token;
    }

    public String[] getTrainingPreferences() {
        return trainingPreferences;
    }

    public static Map<Integer, User> getUsers() {
        return users;
    }
}
