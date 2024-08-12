import BaseController from "./BaseController";

class ActivitiesController extends BaseController {
    constructor(token) {
        super("activities", token);
    }

    async getAllActivities() {
        let data = {};
        await fetch(`${this.apiUrl}/`, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + this.token,
                'Content-Type': 'application/json'
            }
        }).then(res =>
            res.json()
            .then(responseData => {
                data = responseData.data;
            })
            .catch(error => {
                console.error('Error getAllActivities:', error);
            })
        );
        return data;
    }

    async getFeed() {
        let data = {};
        await fetch(`${this.apiUrl}/feed`, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + this.token,
                'Content-Type': 'application/json'
            }
        }).then(res =>
            res.json()
            .then(responseData => {
                data = responseData.data;
            })
            .catch(error => {
                console.error('Error getFeed:', error);
            })
        );
        return data;
    }

    async createActivity(title, description, expires, userId) {
        await fetch(`${this.apiUrl}/create`, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + this.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description,
                expires: expires,
                userId: userId
            })
        }).then(res =>
            res.json()
            .then(responseData => {
                console.log('Creado desde controller: ' + responseData.status);
            })
            .catch(error => {
                console.error('Error createActivity: ', error);
            })
        );
    }
}

export default ActivitiesController;