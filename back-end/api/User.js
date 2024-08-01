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

    setName(name) {
        this.name = name;
        this.saveChangesToDatabase();
    }
    setLastName(lastname) {
        this.lastname = lastname;
        this.saveChangesToDatabase();
    }
    setEmail(email) {
        this.email = email;
        this.saveChangesToDatabase();
    }
    setPhone(phone) {
        this.phone = phone;
        this.saveChangesToDatabase();
    }
    setDescription(description) {
        this.description = description;
        this.saveChangesToDatabase();
    }
    setProficiency(proficiency) {
        this.proficiency = proficiency;
        this.saveChangesToDatabase();
    }
    setTrainingPreferences(trainingPreferences) {
        this.trainingPreferences = trainingPreferences;
        this.saveChangesToDatabase();
    }
    setImg(img) {
        this.img = img ? img : "img1.jpg";
        this.saveChangesToDatabase();
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
    saveChangesToDatabase() {
        f.getSqlManager().updateUser(this)
        .then(e => console.log(`${this.id};${this.email};${this.name} ${this.lastname ? this.lastname : ""}'s information updated!`))
        .catch(e => console.log(`An error ocurred when updating ${this.id};${this.email};${this.name} ${this.lastname ? this.lastname : ""}'s information. Error message: ${e}`));
    }
}