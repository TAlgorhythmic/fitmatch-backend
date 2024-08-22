package com.fitmatch.utils;

public class Urls {

    private static final String baseUrl = "http://localhost:3001";

    private static final String authBaseUrl = baseUrl + "/api/auth";
    private static final String activitiesBaseUrl = baseUrl + "/api/activities";
    private static final String usersBaseUrl = baseUrl + "/api/users";
    private static final String joinedActivitiesBaseUrl = baseUrl + "/api/joinedactivities";
    private static final String requestsBaseUrl = baseUrl + "/api/requests";
    private static final String credentialsBaseUrl = baseUrl + "/api/credentials";

    // Activities router
    public static final String ALL_ACTIVITIES = activitiesBaseUrl + "/";
    public static final String FEED = activitiesBaseUrl + "/feed";
    public static final String CREATE_ACTIVITY = activitiesBaseUrl + "/create";
    public static final String EDIT_ACTIVITY_BY_ID = activitiesBaseUrl + "/edit/"; // ID Needed!
    public static final String ACTIVITY_BY_ID = activitiesBaseUrl + "/get/"; // ID Needed!
    public static final String GETOWN_ACTIVITIES = activitiesBaseUrl + "/getown";
    public static final String DELETE_ACTIVITY_BY_ID = activitiesBaseUrl + "/delete/"; // ID Needed!

    // Auth router
    public static final String LOGIN = authBaseUrl + "/login";
    public static final String REGISTER = authBaseUrl + "/register";
    public static final String VALIDATE_TOKEN = authBaseUrl + "/validate-token";

    // Joinedactivities router
    public static final String JOINED_ACTIVITIES_ALL = joinedActivitiesBaseUrl + "/";
    public static final String LEAVE_ACTIVITY_BY_ID = joinedActivitiesBaseUrl + "/leave/"; // ID Needed!
    public static final String JOIN_ACTIVITY_BY_ID = joinedActivitiesBaseUrl + "/join/"; // ID Needed!
    public static final String NOTJOINED_ACTIVITIES_ALL = joinedActivitiesBaseUrl + "/notjoined";

    // Requests router
    public static final String SEND_FRIEND_REQUEST_SWIPE = requestsBaseUrl + "/send/"; // ID Needed!
    public static final String ACCEPT_FRIEND_REQUEST_NOTIFICATION = requestsBaseUrl + "/accept/"; // ID Needed!
    public static final String GET_PENDING_BY_ID = requestsBaseUrl + "/pendings/"; // ID Needed!
    public static final String GET_PENDINGS_OWN = requestsBaseUrl + "/pendings";
    public static final String PENDING_CREATE = requestsBaseUrl + "/create";
    public static final String REJECT_USER_SWIPE = requestsBaseUrl + "/reject/"; // ID Needed!
    public static final String REJECT_FRIEND_REQUEST_NOTIFICATION = requestsBaseUrl + "/rejectFriendRequest/"; // ID Needed!

    // Users router
    public static final String GET_FRIENDS_ALL = usersBaseUrl + "/friends";
    public static final String GET_CONNECTIONS_ALL = usersBaseUrl + "/connections";
    public static final String CONNECT = usersBaseUrl + "/connect";
    public static final String SETUP = usersBaseUrl + "/setup";
    public static final String EDIT_OWN_PROFILE = usersBaseUrl + "/edit";
    public static final String REMOVE_ACCOUNT = usersBaseUrl + "/removeacc";
    public static final String GET_OWN_PROFILE = usersBaseUrl + "/profile";
    public static final String GET_OTHER_PROFILE = usersBaseUrl + "/profile/"; // ID Needed!
}