package com.fitmatch.core.fetch.controllers;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import com.fitmatch.core.Fitmatch;
import com.fitmatch.core.fetch.Client;
import com.fitmatch.utils.Urls;

public class ActivitiesController {

    private HttpClient client;
    
    public ActivitiesController(Client client) {
        this.client = client.getHttpClient();
    }

    public Object login() throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder(URI.create(Urls.ALL_ACTIVITIES))
            .GET()
            .header("Content-Type", "application/json")
            .build();
        HttpResponse<Object> res = client.send(request, null);
        if (res.statusCode() == 0) {
            // TODO
        }
        return null;
    }
}
