package com.fitmatch.core;

import java.io.InputStreamReader;
import java.time.LocalDateTime;

import com.fitmatch.packets.IPacket;
import com.google.gson.Gson;

public class Activity implements IPacket {

    static Activity[] activities;
    public static void init(Gson gson) {
        try (InputStreamReader reader = new InputStreamReader(Activity.class.getClassLoader().getResourceAsStream("activities.json"))) {
            activities = gson.fromJson(reader, Activity[].class);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static Activity pickRandomActivity() {
        return activities[Fitmatch.getInstance().getRandom().nextInt(activities.length)];
    }
    
    private String title;
    private String description;
    private LocalDateTime expires;
    private String placeholder;
    private double latitude;
    private double longitude;

    public String getDescription() {
        return description;
    }

    public LocalDateTime getExpires() {
        return expires;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public String getPlaceholder() {
        return placeholder;
    }

    public String getTitle() {
        return title;
    }

    public static Activity fromJson(String json) {
        return Fitmatch.getInstance().getGson().fromJson(json, Activity.class);
    }
}
