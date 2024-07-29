const API_URL = "http://localhost:3001/api";

class BaseController {
    constructor(tableName) {
        this.apiUrl = API_URL + "/" + tableName;
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
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data;
    }

}

export default BaseController;