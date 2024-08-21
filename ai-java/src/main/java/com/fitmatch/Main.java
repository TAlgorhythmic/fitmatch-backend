package com.fitmatch;

import java.util.Timer;
import java.util.TimerTask;

import com.fitmatch.core.Fitmatch;
import com.fitmatch.core.User;

public class Main {

    public static void main(String[] args) {
        System.out.println("Starting service...");
        Fitmatch f = Fitmatch.init();
        User.loadUsers();

        
    }


}
