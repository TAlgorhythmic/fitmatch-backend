import f from "./Fitmatch.js";

export default class User {

    constructor(id, name, lastname, email, phone, description, proficiency, trainingPreferences, img, city, lat, long, isSetup) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.phone = phone;
        this.description = description;
        this.proficiency = proficiency;
        this.trainingPreferences = trainingPreferences;
        this.img = img;
        this.city = city;
        this.latitude = lat;
        this.longitude = long;
        this.isSetup = isSetup;
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
        this.indexChange("trainingPreferences", trainingPreferences);
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
        this.indexChange("latitude", lat);
    }
    setLongitude(long) {
        this.longitude = long;
        this.indexChange("longitude", long);
    }
    setLocation(city, latitude, longitude) {
        this.city = city;
        this.latitude = latitude;
        this.longitude = longitude;
        this.saveChangesToDatabase();
    }
    setIsSetup(isSetup) {
        this.isSetup = isSetup;
        this.saveChangesToDatabase();
    }
}