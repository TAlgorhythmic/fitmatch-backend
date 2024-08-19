import BaseController from "./BaseController";

class AuthController extends BaseController {
    constructor(token) {
        super("auth", token);
    }

    async validateToken() {
        const response = await fetch(`${this.apiUrl}/validate-token`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + this.token
            }
        })
        return response;
    }
}

export default AuthController;