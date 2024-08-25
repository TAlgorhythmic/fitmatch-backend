package com.fitmatch.core.fetch.controllers;

import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.io.entity.StringEntity;

import com.fitmatch.core.Fitmatch;
import com.fitmatch.core.ServerUser;
import com.fitmatch.utils.Urls;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import static com.fitmatch.core.fetch.controllers.StatusCodes.*;

public class UsersController {
    
    public UsersController() {
    }
    
    public boolean setup(Packets.Out.PacketSetup packet, String token) {

        try(CloseableHttpClient client = HttpClients.createDefault()) {

            HttpPost post = new HttpPost(Urls.SETUP);
            post.setHeader("Content-Type", "application/json");
            post.setHeader("Authorization", "Bearer " + token);
            post.setEntity(new StringEntity(packet.toJson()));

            try (CloseableHttpResponse res = client.execute(post)) {
                String json = EntityUtils.toString(res.getEntity());

                JsonElement jsonElement = JsonParser.parseString(json);
                int code = jsonElement.getAsJsonObject().get("status").getAsInt();

                if (code == OK) return true;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }

    public int[] friends(String token) {

        try(CloseableHttpClient client = HttpClients.createDefault()) {

            HttpGet get = new HttpGet(Urls.GET_FRIENDS_ALL);

            get.setHeader("Content-Type", "application/json");
            get.setHeader("Authorization", "Bearer " + token);

            try (CloseableHttpResponse res = client.execute(get)) {
                String json = EntityUtils.toString(res.getEntity());

                JsonElement parse = JsonParser.parseString(json);
                int code = parse.getAsJsonObject().get("status").getAsInt();

                if (code == OK) {
                    JsonElement data = parse.getAsJsonObject().get("data");

                    return Fitmatch.getInstance().getGson().fromJson(data, int[].class);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public ServerUser[] connections(String token) {

        try(CloseableHttpClient client = HttpClients.createDefault()) {

            HttpGet get = new HttpGet(Urls.GET_CONNECTIONS_ALL);

            get.setHeader("Content-Type", "application/json");
            get.setHeader("Authorization", "Bearer " + token);

            try (CloseableHttpResponse res = client.execute(get)) {
                String json = EntityUtils.toString(res.getEntity());

                JsonElement jsonElement = JsonParser.parseString(json);
                int code = jsonElement.getAsJsonObject().get("status").getAsInt();

                if (code == OK) {
                    return Fitmatch.getInstance().getGson().fromJson(json, ServerUser[].class);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public ServerUser[] connect(String token) {

        try(CloseableHttpClient client = HttpClients.createDefault()) {

            HttpGet get = new HttpGet(Urls.CONNECT);

            get.setHeader("Content-Type", "application/json");
            get.setHeader("Authorization", "Bearer " + token);

            try (CloseableHttpResponse res = client.execute(get)) {
                String json = EntityUtils.toString(res.getEntity());

                JsonElement jsonElement = JsonParser.parseString(json);
                int code = jsonElement.getAsJsonObject().get("status").getAsInt();

                if (code == OK) {
                    return Fitmatch.getInstance().getGson().fromJson(json, ServerUser[].class);
                }
            }
        } catch (Throwable e) {
            e.printStackTrace();
        }
        return null;
    }

    public ServerUser profile(String token) {

        try (CloseableHttpClient client = HttpClients.createDefault()) {

            HttpGet get = new HttpGet(Urls.GET_OWN_PROFILE);

            get.setHeader("Content-Type", "application/json");
            get.setHeader("Authorization", "Bearer " + token);

            try (CloseableHttpResponse res = client.execute(get)) {
                String json = EntityUtils.toString(res.getEntity());

                JsonElement jsonElement = JsonParser.parseString(json);
                int code = jsonElement.getAsJsonObject().get("status").getAsInt();

                if (code == OK) {
                    return Fitmatch.getInstance().getGson().fromJson(json, ServerUser.class);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }
}
