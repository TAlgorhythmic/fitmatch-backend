package com.fitmatch.core;

import java.io.InputStreamReader;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import com.fitmatch.core.engine.AIBot;
import com.fitmatch.core.fetch.controllers.Packets;
import com.fitmatch.core.fetch.controllers.Packets.Out.PacketSetup;;;

public class User {

    static ConcurrentMap<Integer, User> memoryUsers = new ConcurrentHashMap<>();

    public static User getUserFromId(int id) {
        return memoryUsers.get(id);
    }

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

    private int id;
    private String name, lastname, phone, description, proficiency, img, city, country;
    private final String email;
    private String[] trainingPreferences;
    private double latitude, longitude;
    private boolean isSetup;
    private boolean monday, tuesday, wednesday, thursday, friday, saturday, sunday;
    private int timetable1, timetable2;
    private final String password;
    private String token = null;
    private AIBot bot;

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
        Packets.In.PacketInToken token = Fitmatch.getInstance().getClient().authController.login(new Packets.Out.PacketLogin(this.email, password));
        if (token == null) {
            System.out.println("Login for " + this.email + " failed. Trying to register...");
            token = Fitmatch.getInstance().getClient().authController.register(new Packets.Out.PacketRegister(this.email, name, password));
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
        }
        ServerUser user = Fitmatch.getInstance().getClient().usersController.profile(this.token);
        memoryUsers.put(user.id, this);
        this.id = user.id;
        if (startAfterwards) startScheduling();
        
    }

    public void startScheduling() {
        this.bot = new AIBot(this);
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
}
