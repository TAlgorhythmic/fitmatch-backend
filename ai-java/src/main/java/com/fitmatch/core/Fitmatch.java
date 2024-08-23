package com.fitmatch.core;

import com.fitmatch.core.fetch.Client;
import com.fitmatch.core.fetch.controllers.ActivitiesController;
import com.fitmatch.core.fetch.controllers.AuthController;
import com.google.gson.Gson;

import java.util.Random;
import java.util.Timer;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

public class Fitmatch {

    public static Fitmatch init() {
        instance = new Fitmatch();
        return instance;
    }
    private static Fitmatch instance;
    public static Fitmatch getInstance() {
        return instance;
    }

    private final Gson gson;
    private final Client client;
    private final ScheduledExecutorService scheduler;
    private final Random random;
    private final ActivitiesController activitiesController;
    private final AuthController authController;

    private Fitmatch() {
        this.client = new Client();
        this.gson = new Gson();
        this.scheduler = Executors.newScheduledThreadPool(6);
        this.random = new Random();
        this.activitiesController = new ActivitiesController(this.client);
        this.authController = new AuthController(this.client);
    }

    public void start(User[] users) {
        this.client.fetchUsers(users);
    }

    public Gson getGson() {
        return gson;
    }

    public Client getClient() {
        return client;
    }

    public ExecutorService getScheduler() {
        return scheduler;
    }

    public Random getRandom() {
        return random;
    }

    public ActivitiesController getActivitiesController() {
        return activitiesController;
    }

    public AuthController getAuthController() {
        return authController;
    }
}
