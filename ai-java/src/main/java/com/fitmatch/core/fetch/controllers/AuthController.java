package com.fitmatch.core.fetch.controllers;

import java.io.Closeable;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse.BodyHandlers;

import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.io.entity.StringEntity;

import com.fitmatch.core.Fitmatch;
import com.fitmatch.core.fetch.Client;
import com.fitmatch.core.fetch.controllers.Packets.PacketInToken;
import com.fitmatch.utils.Urls;

import static com.fitmatch.core.fetch.controllers.StatusCodes.*;

public class AuthController {
    
    public AuthController(Client client) {
        this.client = client.getHttpClient();
    }
    
    public PacketInToken login(Packets.PacketLogin packet) {

        try(CloseableHttpClient client = HttpClients.createDefault()) {

            HttpPost post = new HttpPost(Urls.LOGIN);
            post.setHeader("Content-Type", "application/json");
            post.setEntity(new StringEntity(packet.toJson()));

            try (CloseableHttpResponse res = client.execute(post)) {
                if (res.getCode() == OK) return Packets.PacketInToken.fromJson(EntityUtils.toString(res.getEntity()));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    public PacketInToken register(Packets.PacketRegister packet) {

        try(CloseableHttpClient client = HttpClients.createDefault()) {

            HttpPost post = new HttpPost(Urls.REGISTER);
            post.setHeader("Content-Type", "application/json");
            post.setEntity(new StringEntity(packet.toJson()));

            try (CloseableHttpResponse res = client.execute(post)) {
                if (res.getCode() == OK) return Packets.PacketInToken.fromJson(EntityUtils.toString(res.getEntity()));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }
}
