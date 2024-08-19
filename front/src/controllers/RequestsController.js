import BaseController from "./BaseController";

class RequestsController extends BaseController {
    constructor(token) {
        super("requests", token);
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
                    console.log('RequestControl: ' + responseData.data);
                    data = responseData;
                })
                .catch(error => {
                    console.error('Error getFeed:', error);
                })
        );
        return data;
    }
}

export default RequestsController;