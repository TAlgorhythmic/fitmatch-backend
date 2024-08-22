package com.fitmatch.core.fetch;

import java.net.http.HttpClient;
import java.util.Arrays;

import com.fitmatch.core.Fitmatch;
import com.fitmatch.core.User;

public class Client {

    private final HttpClient client;

    public Client() {
        this.client = HttpClient.newHttpClient();
    }

    public void fetchUsers(User[] users) {
        Arrays.stream(users).forEach(item -> {
            Fitmatch.getInstance().getScheduler().submit(() -> item.fetchToken(true));
        });
    }

    public HttpClient getHttpClient() {
        return this.client;
    }
}
