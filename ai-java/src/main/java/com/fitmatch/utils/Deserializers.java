package com.fitmatch.utils;

import java.lang.reflect.Type;

import com.fitmatch.core.ServerActivity;
import com.fitmatch.core.ServerUser;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;

public class Deserializers {

    static Gson preventiveGson = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSX").create();
    static UsersArray usersArray = new UsersArray();
    static UserObject userObject = new UserObject();
    static ActivityObject activityObject = new ActivityObject();
    static ActivitiesArray activitiesArray = new ActivitiesArray();

    public static Gson registerDeserializers() {
        return new GsonBuilder()
            .setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSX")
            .registerTypeAdapter(ServerUser.class, userObject)
            .registerTypeAdapter(ServerUser[].class, usersArray)
            .registerTypeAdapter(ServerActivity.class, activityObject)
            .registerTypeAdapter(ServerActivity[].class, activitiesArray)
            .create();
    }

    static class UsersArray implements JsonDeserializer<ServerUser[]> {

        @Override
        public ServerUser[] deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
                throws JsonParseException {

            JsonElement data = json.getAsJsonObject().get("data");

            return preventiveGson.fromJson(data, ServerUser[].class);
        }
    }

    static class UserObject implements JsonDeserializer<ServerUser> {
        
        @Override
        public ServerUser deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
                throws JsonParseException {
            
            JsonElement data = json.getAsJsonObject().get("data");

            return preventiveGson.fromJson(data, ServerUser.class);
        }
    }

    static class ActivityObject implements JsonDeserializer<ServerActivity> {

        @Override
        public ServerActivity deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
            
            JsonElement data = json.getAsJsonObject().get("data");
            
            return preventiveGson.fromJson(data, ServerActivity.class);
        }
    }

    static class ActivitiesArray implements JsonDeserializer<ServerActivity[]> {

        @Override
        public ServerActivity[] deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
            
            JsonElement data = json.getAsJsonObject().get("data");
            
            return preventiveGson.fromJson(data, ServerActivity[].class);
        }
    }
}
