import BaseController from "./BaseController";

class JoinedActivitiesController extends BaseController {
    constructor(token) {
        super("joinedactivities", token);
    }

    async getAllJoinedActivities() {
        let data = {};
        let response = await fetch(`${this.apiUrl}/`, {
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
            })
            .catch(error => {
                console.error('Error getAllJoinedActivities:', error);
            })
        );
        return data;
    }

    // Función para obtener actividades no unidas, hay que pasa el id del usuario, preguntar luego si se puede hacer con el token

    /*async getNotJoined() {
        let data = {};
        let response = await fetch(`${this.apiUrl}/`, {
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
            })
            .catch(error => {
                console.error('Error getAllJoinedActivities:', error);
            })
        );
        return data;
    }*/

    async joinActivity(id) {
        let data = {};
        let response = await fetch(`${this.apiUrl}/join/${id}`, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + this.token,
                'Content-Type': 'application/json'
            }
        }).then(res =>
            res.json()
            .then(responseData => {
                console.log(responseData);
                data = responseData.data;
            })
            .catch(error => {
                console.error('Error joinActivity:', error);
            })
        );
        return data;
    }

    async leaveActivity(id) {
        let data = {};
        let response = await fetch(`${this.apiUrl}/leave/${id}`, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + this.token,
                'Content-Type': 'application/json'
            }
        }).then(res =>
            res.json()
            .then(responseData => {
                console.log(responseData);
                data = responseData.data;
            })
            .catch(error => {
                console.error('Error leaveActivity:', error);
            })
        );
        return data;
    }
}

export default JoinedActivitiesController;