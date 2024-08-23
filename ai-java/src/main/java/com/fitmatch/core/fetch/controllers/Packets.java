package com.fitmatch.core.fetch.controllers;

import com.fitmatch.core.Fitmatch;
import com.fitmatch.packets.IPacket;

public class Packets {

    public static class PacketInToken implements IPacket {

        public String token;
        public boolean isSetup;
        public int status;

        public static PacketInToken fromJson(String json) {
            return Fitmatch.getInstance().getGson().fromJson(json, PacketInToken.class);
        }
    }

    public static class PacketRegister implements IPacket {

        public String phone;
        public String name;
        public String password;

        public PacketRegister(String phone, String name, String password) {
            this.phone = phone;
            this.name = name;
            this.password = password;
        }
    }

    public static class PacketLogin implements IPacket {

        public String field;
        public String password;

        public PacketLogin(String field, String password) {
            this.field = field;
            this.password = password;
        }
    }
}