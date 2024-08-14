import BaseController from "./BaseController";

class JoinedActivitiesController extends BaseController {
    constructor(token) {
        super("joinedactivities", token);
    }

    async getAllJoinedActivities() {
        let data = undefined;
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
                console.error('Error getAllJoinedActivities:', error);
            })
        );
        return data;
    }

    async joinActivity(id) {
        await fetch(`${this.apiUrl}/join/${id}`, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + this.token,
                'Content-Type': 'application/json'
            }
        }).then(res =>
            res.json()
            .then(responseData => {
                console.log('Unido desde controller: ' + responseData.status);
            })
            .catch(error => {
                console.error('Error joinActivity: ', error);
            })
        );
    }

    async leaveActivity(id) {
        await fetch(`${this.apiUrl}/leave/${id}`, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + this.token,
                'Content-Type': 'application/json'
            }
        }).then(res =>
            res.json()
            .then(responseData => {
                console.log('Eliminado desde controller: ' + responseData.error);
            })
            .catch(error => {
                console.error('Error leaveActivity:', error);
            })
        );
    }
}

export default JoinedActivitiesController;