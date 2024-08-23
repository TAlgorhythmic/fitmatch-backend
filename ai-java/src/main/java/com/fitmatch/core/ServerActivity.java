package com.fitmatch.core;

import java.sql.Timestamp;
import java.time.LocalDateTime;

public class ServerActivity {
    
    public int id;
    public String title;
    public String description;
    public Timestamp postDate;
    public LocalDateTime expires;
    public int userId;
    public String placeholder;
    public double latitude;
    public double longitude;
    public ServerUser user;
    public ServerUser[] joinedUsers;

    public static ServerActivity fromJson(String json) {
        return Fitmatch.getInstance().getGson().fromJson(json, ServerActivity.class);
    }
}
