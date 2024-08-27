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
                    data = responseData;
                })
                .catch(error => {
                    console.error('Error getAllActivities:', error);
                })
        );
        return data;
    }

    async getCreateFeedSession() {
        let data = {};
        await fetch(`${this.apiUrl}/feedsession`, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + this.token,
                'Content-Type': 'application/json'
            }
        }).then(res =>
            res.json()
                .then(responseData => {
                    data = responseData;
                })
                .catch(error => {
                    console.error('Error getFeed:', error);
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
                    data = responseData;
                })
                .catch(error => {
                    console.error('Error getFeed:', error);
                })
        );
        return data;
    }

    async createActivity(title, description, expires, placeholder, latitude, longitude) {
        let data = undefined;
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
                placeholder: placeholder,
                latitude: latitude,
                longitude: longitude
            })
        }).then(res => res.json())
            .then(responseData => {
                data = responseData;
                console.log(responseData);
            })
            .catch(error => {
                console.error('Error createActivity: ', error);
                throw new Error('Error al crear la actividad');
            });
        return data;
    }

    async updateActivity(id, title, description, expires, address, latitude, longitude) {
        const res = await fetch(`${this.apiUrl}/edit/${id}`, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + this.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description,
                expires: expires,
                placeholder: address,
                latitude: latitude,
                longitude: longitude
            })
        });
        const data = await res.json();
        return data;
    }

    async getOwnActivities() {
        try {
            const response = await fetch(`${this.apiUrl}/getown`, {
                method: 'GET',
                headers: {
                    "Authorization": "Bearer " + this.token,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.error(`Error: ${response.status} ${response.statusText}`);
                return null;
            }

            const responseData = await response.json();
            console.log('ActivitiesController:', responseData.status);

            return responseData;
        } catch (error) {
            console.error('Error getOwnActivities:', error);
            return null;
        }
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
                    console.log(responseData);
                    data = responseData.data;
                    console.log(data);
                })
                .catch(error => {
                    console.error('Error getActivity: ', error);
                })
        );
        return data;
    }

    async deleteActivity(id) {
    try {
        const response = await fetch(`${this.apiUrl}/delete/${id}`, {
            method: 'DELETE',
            headers: {
                "Authorization": "Bearer " + this.token,
                'Content-Type': 'application/json'
            }
        });

        return await response.json();
    } catch (error) {
        console.error('Error leaveActivity: ', error);
        throw new Error("Failed to delete activity: " + error.message);
    }
}


}

export default ActivitiesController;