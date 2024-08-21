package com.fitmatch.utils;

import com.fitmatch.core.Fitmatch;

public class Utils {

    private static final String[] PREFERENCES = {
            "Swimming", "Cycling", "Powerlifting", "Yoga", "Running", "CrossFit",
            "Bodybuilding", "Pilates", "Boxing", "HIIT", "Weightlifting",
            "Cardio", "Zumba", "Spinning", "Martial Arts"
    };

    private static final String[] PROFICIENCIES = {"Principiante", "Intermedio", "Avanzado"};


    public static String getRandomPreference() {
        return PREFERENCES[Fitmatch.getInstance().getRandom().nextInt(PREFERENCES.length)];
    }

    public static String getRandomProficiency() {
        return PROFICIENCIES[Fitmatch.getInstance().getRandom().nextInt(PROFICIENCIES.length)];
    }
}
