const API_URL = "http://localhost:3001/api";

class BaseController {
    constructor(tableName, token) {
        this.apiUrl = API_URL + "/" + tableName;
        this.token = token;
        this.tableName = tableName;
    }

    async getTableName() {
        return this.tableName;
    }

    async getApiUrl() {
        return this.apiUrl;        
    }

    async getAll() {
        const response = await fetch(this.apiUrl, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + this.token,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data;
    }

    async getItemById(id) {
        const response = await fetch(`${this.apiUrl}/get/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + this.token
            }
        });

        const data = await response.json();
        return data;
    }
    async createItem(itemData) {
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + this.token // Si necesitas un token para autenticación
            },
            body: JSON.stringify(itemData)
        });

        const data = await response.json();
        console.log(data);
        return data;
    }

}

export default BaseController;