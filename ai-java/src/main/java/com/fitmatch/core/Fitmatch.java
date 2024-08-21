package com.fitmatch.core;

import com.fitmatch.core.fetch.Client;
import com.google.gson.Gson;

import java.util.Random;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Fitmatch {

    public static void init() {
        instance = new Fitmatch();
    }
    private static Fitmatch instance;
    public static Fitmatch getInstance() {
        return instance;
    }

    private final Gson gson;
    private final Client client;
    private final ExecutorService scheduler;
    private final Random random;

    private Fitmatch() {
        this.client = new Client();
        this.gson = new Gson();
        this.scheduler = Executors.newCachedThreadPool();
        this.random = new Random();
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
}
