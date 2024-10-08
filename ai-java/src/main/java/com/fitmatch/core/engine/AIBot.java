package com.fitmatch.core.engine;

import java.util.Arrays;
import java.util.TimerTask;

import com.fitmatch.core.Activity;
import com.fitmatch.core.Fitmatch;
import com.fitmatch.core.ServerActivity;
import com.fitmatch.core.ServerUser;
import com.fitmatch.core.User;

public class AIBot {

    private static final int FEED = 0;
    private static final int CREATE_ACTIVITY = 1;
    private static final int CONNECT = 2;

    private User user;
    private boolean isSessionCreated = false;
    
    public AIBot(User user) {
        this.user = user;
        startAcceptingRequests();
        startRandom();
    }

    public User getUser() {
        return user;
    }

    public void startRandom() {
        long random = (Fitmatch.getInstance().getRandom().nextInt(30) + 30) * 1000;
        Fitmatch.getInstance().getScheduler().scheduleAtFixedRate(new TimerTask() {
            public void run() {
                doRandomAction();
            };
        }, random, random);
    }

    public void startAcceptingRequests() {
        Fitmatch.getInstance().getScheduler().scheduleAtFixedRate(new TimerTask() {
            
            public void run() {
                ServerUser[] users = Fitmatch.getInstance().getClient().requestsController.getPendings(AIBot.this.user.getToken());
                Arrays.stream(users).forEach(user -> {
                    Fitmatch.getInstance().getClient().requestsController.acceptFriendRequest(AIBot.this.user.getToken(), user.id);
                });
            };
        }, 30000L, 30000L);
    }

    public void doRandomAction() {
        int action = Fitmatch.getInstance().getRandom().nextInt(3);

        switch (action) {
            case FEED: {
                System.out.println(this.user.getEmail() + " is issuing a feed request. Joining all activities posible...");

                ServerActivity[] activities;
                if (!this.isSessionCreated) {
                    activities = Fitmatch.getInstance().getClient().activitiesController.feedSession(this.user.getToken());
                    this.isSessionCreated = activities != null;
                } else {
                    activities = Fitmatch.getInstance().getClient().activitiesController.feed(this.user.getToken());
                }
                
                if (activities == null) {
                    System.out.println("activities is null");
                    return;
                }
                Arrays.stream(activities).forEach(activity -> {
                    boolean joined = Fitmatch.getInstance().getClient().activitiesController.join(this.user.getToken(), activity.id);
                    if (!joined) System.out.println(this.user.getEmail() + " failed to join activity with id " + activity.id);
                });
                break;
            }
            case CREATE_ACTIVITY: {
                System.out.println(this.user.getEmail() + " is issuing a create activity request. Picking a random pregenerated activity...");
                boolean created = Fitmatch.getInstance().getClient().activitiesController.create(Activity.pickRandomActivity(), this.user.getToken());
                if (!created) System.out.println(this.user.getEmail() + " failed to create an activity.");
                break;
            }
            case CONNECT: {
                System.out.println(this.user.getEmail() + " is issuing a connect request. Sending all friend requests possible...");
                ServerUser[] users = Fitmatch.getInstance().getClient().usersController.connect(this.user.getToken());
                if (users == null) {
                    System.out.println(this.user.getEmail() + " has a lot of friends.");
                    return;
                }
                Arrays.stream(users).forEach(user -> {
                    boolean sent = Fitmatch.getInstance().getClient().requestsController.sendFriendRequest(this.user.getToken(), user.id);
                    if (!sent) System.out.println(this.user.getEmail() + " failed to send a friend request.");
                });
                break;
            }
        }
    }
}
