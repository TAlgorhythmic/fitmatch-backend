package com.fitmatch.core.fetch;

import java.util.Arrays;

import com.fitmatch.core.Fitmatch;
import com.fitmatch.core.User;

public class Client {

    public void fetchUsers(User[] users) {
        Arrays.stream(users).forEach(item -> {
            Fitmatch.getInstance().getScheduler().submit(() -> item.fetchToken(true));
        });
    } 
}
