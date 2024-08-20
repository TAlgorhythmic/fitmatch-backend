import BaseController from "./BaseController";

class RequestsController extends BaseController {
    constructor(token) {
        super("requests", token);
    }
}

export default RequestsController;