package com.fitmatch.core.fetch.controllers;

import static com.fitmatch.core.fetch.controllers.StatusCodes.OK;

import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.io.entity.StringEntity;

import com.fitmatch.core.Activity;
import com.fitmatch.core.Fitmatch;
import com.fitmatch.core.ServerActivity;
import com.fitmatch.utils.Urls;

public class ActivitiesController {
    
    public ActivitiesController() {}

    public ServerActivity[] feed(String token) {
        try(CloseableHttpClient client = HttpClients.createDefault()) {

            HttpGet post = new HttpGet(Urls.FEED);
            post.setHeader("Content-Type", "application/json");
            post.setHeader("Authorization", "Bearer " + token);

            try (CloseableHttpResponse res = client.execute(post)) {
                if (res.getCode() == OK) Fitmatch.getInstance().getGson().fromJson(EntityUtils.toString(res.getEntity()), ServerActivity[].class);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean create(Activity packet, String token) {

        try(CloseableHttpClient client = HttpClients.createDefault()) {

            HttpPost post = new HttpPost(Urls.CREATE_ACTIVITY);
            post.setHeader("Content-Type", "application/json");
            post.setHeader("Authorization", "Bearer " + token);
            post.setEntity(new StringEntity(packet.toJson()));

            try (CloseableHttpResponse res = client.execute(post)) {
                if (res.getCode() == OK) return true;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }
}
