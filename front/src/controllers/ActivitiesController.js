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

    async createActivity(title, description, expires) {
        await fetch(`${this.apiUrl}/create`, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + this.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description,
                expires: expires
            })
        }).then(res => res.json())
            .then(responseData => {
                console.log('ActivitiesController: ' + responseData.status);
            })
            .catch(error => {
                console.error('Error createActivity: ', error);
                throw new Error('Error al crear la actividad');
            });
    }

    async updateActivity(id, title, description, expires) {
        await fetch(`${this.apiUrl}/edit/${id}`, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + this.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description,
                expires: expires
            })
        }).then(res => res.json())
            .then(responseData => {
                console.log('ActivitiesController: ' + responseData.status);
            })
            .catch(error => {
                console.error('Error updateActivity: ', error);
                throw new Error('Error al actualizar la actividad');
            });
    }

    async getOwnActivities() {
        let data = [];
        await fetch(`${this.apiUrl}/getown`, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + this.token,
                'Content-Type': 'application/json'
            }
        }).then(res =>
            res.json()
                .then(responseData => {
                    console.log('ActivitiesController: ' + responseData.status);
                    data = responseData;
                })
                .catch(error => {
                    console.error('Error getOwnActivities: ', error);
                })
        );
        return data;
    }

    async getActivityById(id) {
        let data = {};
        await fetch(`${this.apiUrl}/get/${id}`, {
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
                    console.error('Error getActivity: ', error);
                })
        );
        return data;
    }
}

export default ActivitiesController;