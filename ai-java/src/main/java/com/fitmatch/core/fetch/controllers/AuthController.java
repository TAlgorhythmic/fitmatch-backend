package com.fitmatch.core.fetch.controllers;

import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ContentType;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.io.entity.StringEntity;

import com.fitmatch.core.fetch.controllers.Packets.In.PacketInToken;
import com.fitmatch.utils.Urls;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import static com.fitmatch.core.fetch.controllers.StatusCodes.*;

public class AuthController {
    
    public AuthController() {}
    
    public PacketInToken login(Packets.Out.PacketLogin packet) {

        try(CloseableHttpClient client = HttpClients.createDefault()) {

            HttpPost post = new HttpPost(Urls.LOGIN);
            post.setHeader("Content-Type", "application/json");
            post.setEntity(new StringEntity(packet.toJson(), ContentType.APPLICATION_JSON.withCharset("UTF-8")));

            try (CloseableHttpResponse res = client.execute(post)) {
                String json = EntityUtils.toString(res.getEntity(), "UTF-8");

                JsonElement jsonElement = JsonParser.parseString(json);
                int code = jsonElement.getAsJsonObject().get("status").getAsInt();
                
                if (code == OK) {
                    return PacketInToken.fromJson(json);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    public PacketInToken register(Packets.Out.PacketRegister packet) {

        try(CloseableHttpClient client = HttpClients.createDefault()) {

            HttpPost post = new HttpPost(Urls.REGISTER);
            post.setHeader("Content-Type", "application/json");
            post.setEntity(new StringEntity(packet.toJson(), ContentType.APPLICATION_JSON.withCharset("UTF-8")));

            try (CloseableHttpResponse res = client.execute(post)) {
                String json = EntityUtils.toString(res.getEntity(), "UTF-8");

                JsonElement jsonElement = JsonParser.parseString(json);
                int code = jsonElement.getAsJsonObject().get("status").getAsInt();

                if (code == OK) return PacketInToken.fromJson(json);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }
}
