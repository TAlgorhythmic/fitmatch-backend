package com.fitmatch.core.fetch.controllers;

import java.net.URI;
import java.net.http.HttpRequest;

import com.fitmatch.utils.Urls;

public class ActivitiesController {

    static 
    
    public ActivitiesController() {}

    public Object getAllActivities(String token) {
        HttpRequest request = HttpRequest.newBuilder(URI.create(Urls.ALL_ACTIVITIES))
            .GET()
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + token)
            .build();
        
    }
}
