package com.fitmatch.core.fetch.controllers;

import java.net.http.HttpClient;

import com.fitmatch.core.Fitmatch;

public class AuthController {
    
    static HttpClient client = Fitmatch.getInstance().getClient().getHttpClient();

    
}
