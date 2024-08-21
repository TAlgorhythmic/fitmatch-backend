package com.fitmatch;

import com.fitmatch.core.Fitmatch;
import com.fitmatch.core.User;

public class Main {

    public static void main(String[] args) {
        System.out.println("Starting service...");
        Fitmatch f = Fitmatch.init();

        User[] users = User.loadUsers();
        if (users == null) {
            System.out.println("Users is null, exiting service...");
            System.exit(-1);
        }
        f.start(users);
    }
}
