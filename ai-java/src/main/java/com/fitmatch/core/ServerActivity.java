package com.fitmatch.core;

public class ServerActivity {
    
    public int id;
    public String title;
    public String description;
    public String postDate;
    public String expires;
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
