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

    // Devuelve solamente los ID de los amigos
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

    // Devuelve todos los datos de los amigos
    async getConnections() {
        let data = [];
        await fetch(`${this.apiUrl}/connections`, {
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
                    console.error('Error getConnections:', error);
                })
        );
        return data;
    }
}

export default UsersController;