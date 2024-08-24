package com.fitmatch.core;

import com.fitmatch.core.fetch.Client;
import com.fitmatch.utils.Deserializers;
import com.google.gson.Gson;

import java.util.Random;
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

    private Fitmatch() {
        this.gson = Deserializers.registerDeserializers();
        Activity.init();
        this.scheduler = Executors.newSingleThreadScheduledExecutor();
        this.random = new Random();
        this.client = new Client();
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

    public ScheduledExecutorService getScheduler() {
        return scheduler;
    }

    public Random getRandom() {
        return random;
    }
}
