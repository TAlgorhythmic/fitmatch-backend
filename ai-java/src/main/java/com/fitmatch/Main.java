package com.fitmatch;

import com.fitmatch.core.Fitmatch;
import com.fitmatch.core.User;

public class Main {

    public static void main(String[] args) {
        Fitmatch.init();
        User.loadUsers();
    }


}
