package com.fitmatch.core.fetch.controllers;

import com.fitmatch.core.Fitmatch;
import com.fitmatch.core.User;
import com.fitmatch.packets.IPacket;

public class Packets {

    public static class In {
        public static class PacketInToken implements IPacket {

            public String token;
            public boolean isSetup;
            public int status;
    
            public static PacketInToken fromJson(String json) {
                return Fitmatch.getInstance().getGson().fromJson(json, PacketInToken.class);
            }
        }

        public static class PacketInOk implements IPacket {

            public int status;

            public static PacketInOk fromJson(String json) {
                return Fitmatch.getInstance().getGson().fromJson(json, PacketInOk.class);
            }
        }
    }

    public static class Out {
        public static class PacketRegister implements IPacket {

            public String phone;
            public String name;
            public String password;
            public boolean skipVerification = true; // Use backdoor to skip verification, for testing and showcase purposes.
    
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

        
    
        public static class PacketSetup implements IPacket {
    
            public String email;
            public String[] preferences;
            public String lastName;
            public String description;
            public String proficiency;
            public String city;
            public double latitude;
            public double longitude;
            public boolean monday;
            public boolean tuesday;
            public boolean wednesday;
            public boolean thursday;
            public boolean friday;
            public boolean saturday;
            public boolean sunday;
            public int timetable1;
            public int timetable2;
    
            public PacketSetup(User user) {
                this.email = user.getEmail();
                this.preferences = user.getTrainingPreferences();
                this.lastName = user.getLastname();
                this.description = user.getDescription();
                this.proficiency = user.getProficiency();
                this.city = user.getCity();
                this.latitude = user.getLatitude();
                this.longitude = user.getLongitude();
                this.monday = user.isMonday();
                this.tuesday = user.isTuesday();
                this.wednesday = user.isWednesday();
                this.thursday = user.isThursday();
                this.friday = user.isFriday();
                this.saturday = user.isSaturday();
                this.sunday = user.isSunday();
                this.timetable1 = user.getTimetable1();
                this.timetable2 = user.getTimetable2();
            }
        }
    }
}