package com.fitmatch.core.fetch.controllers;

import static com.fitmatch.core.fetch.controllers.StatusCodes.OK;

import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.io.entity.EntityUtils;

import com.fitmatch.core.Fitmatch;
import com.fitmatch.core.ServerUser;
import com.fitmatch.utils.Urls;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

public class RequestsController {

    public RequestsController() {}
    
    public boolean sendFriendRequest(String token, int other_id) {

        try (CloseableHttpClient client = HttpClients.createDefault()) {

            HttpPost post = new HttpPost(Urls.SEND_FRIEND_REQUEST_SWIPE + other_id);
            post.setHeader("Content-Type", "application/json");
            post.setHeader("Authorization", "Bearer " + token);

            try (CloseableHttpResponse res = client.execute(post)) {
                String json = EntityUtils.toString(res.getEntity(), "UTF-8");

                JsonElement jsonElement = JsonParser.parseString(json);
                int code = jsonElement.getAsJsonObject().get("status").getAsInt();

                if (code == OK) return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean acceptFriendRequest(String token, int other_id) {

        try (CloseableHttpClient client = HttpClients.createDefault()) {

            HttpPost post = new HttpPost(Urls.ACCEPT_FRIEND_REQUEST_NOTIFICATION + other_id);
            post.setHeader("Content-Type", "application/json");
            post.setHeader("Authorization", "Bearer " + token);

            try (CloseableHttpResponse res = client.execute(post)) {
                String json = EntityUtils.toString(res.getEntity(), "UTF-8");

                JsonElement jsonElement = JsonParser.parseString(json);
                boolean code = jsonElement.getAsJsonObject().get("ok").getAsBoolean();

                if (code) return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public ServerUser[] getPendings(String token) {

        try (CloseableHttpClient client = HttpClients.createDefault()) {

            HttpGet get = new HttpGet(Urls.GET_PENDINGS_OWN);
            get.setHeader("Content-Type", "application/json");
            get.setHeader("Authorization", "Bearer " + token);

            try (CloseableHttpResponse res = client.execute(get)) {
                String json = EntityUtils.toString(res.getEntity(), "UTF-8");

                JsonElement jsonElement = JsonParser.parseString(json);
                int code = jsonElement.getAsJsonObject().get("status").getAsInt();

                if (code == OK) return Fitmatch.getInstance().getGson().fromJson(json, ServerUser[].class);
                else System.out.println(json);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
