import f from "./Fitmatch.js";

export default class User {

    constructor(id, name, lastname, email, phone, description, proficiency, trainingPreferences, img, city, lat, long, isSetup, monday, tuesday, wednesday, thursday, friday, saturday, sunday, timetable1, timetable2, country) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.phone = phone;
        this.description = description;
        this.proficiency = proficiency;
        if (typeof trainingPreferences === "string" || trainingPreferences instanceof String) {
            this.trainingPreferences = trainingPreferences.split(";");
        } else if (Array.isArray(trainingPreferences)) {
            this.trainingPreferences = trainingPreferences;
        } else {
            this.trainingPreferences = null;
        }
        this.img = img;
        this.city = city;
        this.latitude = parseFloat(lat);
        this.longitude = parseFloat(long);
        this.isSetup = isSetup;
        this.monday = monday;
        this.tuesday = tuesday;
        this.wednesday = wednesday;
        this.thursday = thursday;
        this.friday = friday;
        this.saturday = saturday;
        this.sunday = sunday;
        if (typeof timetable1 === "number" || timetable1 instanceof Number) {
            const extraMinutesTemp = timetable1 % 60;
            const hoursTemp = Math.floor(timetable1 / 60);
            const extraMinutes = extraMinutesTemp.toString().length < 2 ? "0" + extraMinutesTemp : extraMinutesTemp;
            const hours = hoursTemp.toString().length < 2 ? "0" + hoursTemp : hoursTemp;
            this.timetable1 = hours + ":" + extraMinutes;
        } else {
            this.timetable1 = timetable1;
        }
        if (typeof timetable2 === "number" || timetable2 instanceof Number) {
            const extraMinutesTemp = timetable2 % 60;
            const hoursTemp = Math.floor(timetable2 / 60);
            const extraMinutes = extraMinutesTemp.toString().length < 2 ? "0" + extraMinutesTemp : extraMinutesTemp;
            const hours = hoursTemp.toString().length < 2 ? "0" + hoursTemp : hoursTemp;
            this.timetable2 = hours + ":" + extraMinutes;
        } else {
            this.timetable2 = timetable2;
        }
        this.country = country ? country : null;
    }

    indexChange(field, value) {
        if (f.getUserManager().containsKey(this.id)) {
            f.getUserManager().get(this.id).onModify(field, value);
        }
    }

    setName(name) {
        this.name = name;
        this.indexChange("name", name);
    }
    setLastName(lastname) {
        this.lastname = lastname;
        this.indexChange("lastname", lastname);
    }
    setEmail(email) {
        this.email = email;
        this.indexChange("email", email);
    }
    setPhone(phone) {
        this.phone = phone;
        this.indexChange("phone", phone);
    }
    setDescription(description) {
        this.description = description;
        this.indexChange("description", description);
    }
    setProficiency(proficiency) {
        this.proficiency = proficiency;
        this.indexChange("proficiency", proficiency);
    }
    setTrainingPreferences(trainingPreferences) {
        this.trainingPreferences = trainingPreferences;
        this.indexChange("trainingPreferences", Array.isArray(trainingPreferences) ? trainingPreferences.join(";") : null);
    }
    setImg(img) {
        this.img = img ? img : "img1.jpg";
        this.indexChange("img", this.img);
    }
    setCity(city) {
        this.city = city;
        this.indexChange("city", city);
    }
    setLatitude(lat) {
        this.latitude = lat;
        this.indexChange("latitude", lat ? lat.toString() : null);
    }
    setLongitude(long) {
        this.longitude = long;
        this.indexChange("longitude", long ? long.toString() : null);
    }
    setLocation(city, latitude, longitude) {
        this.city = city;
        this.latitude = latitude;
        this.longitude = longitude;
        this.indexChange("city", city);
        this.indexChange("latitude", latitude ? latitude.toString() : null);
        this.indexChange("longitude", longitude ? longitude.toString() : null);
    }
    setIsSetup(isSetup) {
        this.isSetup = isSetup;
        this.indexChange("isSetup", isSetup);
    }
    setMonday(bool) {
        this.monday = bool;
        this.indexChange("monday", bool);
    }
    setTuesday(bool) {
        this.tuesday = bool;
        this.indexChange("tuesday", bool);
    }
    setWednesday(bool) {
        this.wednesday = bool;
        this.indexChange("wednesday", bool);
    }
    setCountry(str) {
        this.country = str;
        this.indexChange("country", str);
    }
    setThursday(bool) {
        this.thursday = bool;
        this.indexChange("thursday", bool);
    }
    setFriday(bool) {
        this.friday = bool;
        this.indexChange("friday", bool);
    }
    setSaturday(bool) {
        this.saturday = bool;
        this.indexChange("saturday", bool);
    }
    setSunday(bool) {
        this.sunday = bool;
        this.indexChange("sunday", bool);
    }
    setTimetable1(int) {
        this.timetable1 = int;
        this.indexChange("timetable1", int);
    }
    setTimetable2(int) {
        this.timetable2 = int;
        this.indexChange("timetable2", int);
    }
}