package com.fitmatch.core;

import java.io.InputStreamReader;

import com.fitmatch.packets.IPacket;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class Activity implements IPacket {

    static Activity[] activities;
    public static void init() {
        try (InputStreamReader reader = new InputStreamReader(Activity.class.getClassLoader().getResourceAsStream("activities.json"))) {
            Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
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
    private String expires;
    private String placeholder;
    private double latitude;
    private double longitude;

    public String getDescription() {
        return description;
    }

    public String getExpires() {
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
