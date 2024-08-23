package com.fitmatch.core.fetch;

import java.util.Arrays;

import com.fitmatch.core.Fitmatch;
import com.fitmatch.core.User;
import com.fitmatch.core.fetch.controllers.ActivitiesController;
import com.fitmatch.core.fetch.controllers.AuthController;
import com.fitmatch.core.fetch.controllers.RequestsController;
import com.fitmatch.core.fetch.controllers.UsersController;

public class Client {

    public final ActivitiesController activitiesController;
    public final AuthController authController;
    public final UsersController usersController;
    public final RequestsController requestsController;

    public Client() {
        this.activitiesController = new ActivitiesController();
        this.authController = new AuthController();
        this.usersController = new UsersController();
        this.requestsController = new RequestsController();
    }

    public void fetchUsers(User[] users) {
        Arrays.stream(users).forEach(item -> {
            Fitmatch.getInstance().getScheduler().submit(() -> item.fetchToken(true));
        });
    }
}
