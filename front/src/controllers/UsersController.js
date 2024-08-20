import BaseController from './BaseController.js'

class UsersController extends BaseController {
    constructor(token) {
        super("users", token);
    }

    async uploadImage() {
        // TODO
    }

    async getCompatibleUsers() {
        let data = [];
        await fetch(`${this.apiUrl}/connect`, {
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

    async getProfile() {
        let data = {};
        await fetch(`${this.apiUrl}/profile`, {
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

    // Obtener lista de IDs de usuarios agregados
    async getFriends() {
        let data = [];
        await fetch(`${this.apiUrl}/friends`, {
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
                    console.error('Error getFriends:', error);
                })
        );
        return data;
    }
}

export default UsersController;