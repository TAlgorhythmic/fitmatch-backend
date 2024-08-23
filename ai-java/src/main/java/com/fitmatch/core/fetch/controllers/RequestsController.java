package com.fitmatch.core.fetch.controllers;

import static com.fitmatch.core.fetch.controllers.StatusCodes.OK;

import java.net.http.HttpClient;

import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.io.entity.EntityUtils;

import com.fitmatch.core.Fitmatch;
import com.fitmatch.core.ServerUser;
import com.fitmatch.utils.Urls;

public class RequestsController {

    public RequestsController() {}
    
    public boolean sendFriendRequest(String token, int other_id) {

        try (CloseableHttpClient client = HttpClients.createDefault()) {

            HttpPost post = new HttpPost(Urls.SEND_FRIEND_REQUEST_SWIPE + other_id);
            post.setHeader("Content-Type", "application/json");
            post.setHeader("Authorization", "Bearer " + token);

            try (CloseableHttpResponse res = client.execute(post)) {
                if (res.getCode() == OK) return true;
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
                if (res.getCode() == OK) return true;
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
                if (res.getCode() == OK) return Fitmatch.getInstance().getGson().fromJson(EntityUtils.toString(res.getEntity()), ServerUser[].class);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
