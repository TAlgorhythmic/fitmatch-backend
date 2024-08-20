package com.fitmatch.utils;

public class Urls {

    private static final String baseUrl = "http://localhost:3001";

    private static final String authBaseUrl = baseUrl + "/api/auth";
    private static final String activitiesBaseUrl = baseUrl + "/api/activities";
    private static final String usersBaseUrl = baseUrl + "/api/users";
    private static final String joinedActivitiesBaseUrl = baseUrl + "/api/joinedactivities";
    private static final String requestsBaseUrl = baseUrl + "/api/requests";
    private static final String credentialsBaseUrl = baseUrl + "/api/credentials";

    public static final String ALL_ACTIVITIES;
    public static final String FEED;
    public static final String CREATE_ACTIVITY;
    public static final String EDIT_ACTIVITY_BY_ID;
    public static final String ACTIVITY_BY_ID;
    public static final String GETOWN_ACTIVITIES;
    public static final String DELETE_ACTIVITY_BY_ID;

    public static final String LOGIN;
    public static final String REGISTER;
    public static final String VALIDATE_TOKEN;

    public static final String JOINED_ACTIVITIES_ALL;
    public static final String LEAVE_ACTIVITY_BY_ID;
    public static final String JOIN_ACTIVITY_BY_ID;
    public static final String NOTJOINED_ACTIVITIES_ALL;

    public static final String SEND_FRIEND_REQUEST_SWIPE;
    public static final String ACCEPT_FRIEND_REQUEST_NOTIFICATION;
    public static final String GET_PENDING_BY_ID;
    public static final String GET_PENDINGS_OWN;
    public static final String PENDING_CREATE;

    
}
