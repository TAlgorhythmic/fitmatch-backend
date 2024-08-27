import f from "./Fitmatch.js";

export default class Activity {

    constructor(id, title, description, postDate, expires, userId, placeholder, latitude, longitude) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.postDate = new Date(postDate);
        this.userId = userId;
        this.placeholder = placeholder;
        this.latitude = parseFloat(latitude);
        this.longitude = parseFloat(longitude);
        this.expires = new Date(expires);
    }

    setExpires(expires) {
        this.expires = new Date(expires);
        this.indexChange(this.expires);
    }

    setTitle(title) {
        this.title = title;
        this.indexChange("title", title);
    }

    setDescription(description) {
        this.description = description;
        this.indexChange("description", description);
    }

    setPostDate(postDate) {
        this.postDate = new Date(postDate);
        this.indexChange("postDate", this.postDate);
    }

    setPlaceholder(placeholder) {
        this.placeholder = placeholder;
        this.indexChange("placeholder", placeholder);
    }

    setLatitude(latitude) {
        this.latitude = parseInt(latitude);
        this.indexChange("latitude", this.latitude);
    }

    setLongitude(longitude) {
        this.longitude = parseInt(longitude);
        this.indexChange("longitude", this.longitude);
    }

    indexChange(field, value) {
        if (f.activitiesManager.containsKey(this.id)) {
            f.activitiesManager.get(this.id).onModify(field, value);
        }
    }
}