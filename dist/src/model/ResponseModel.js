"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseModel {
    constructor(data, message) {
        this.data = data;
        this.message = message;
        this.data = data;
        this.message = message;
    }
}
exports.ResponseModel = ResponseModel;
class ResponseSender {
    constructor(response) {
        this.response = response;
        this.response = response;
    }
    send(data) {
        this.response.json(new ResponseModel(data));
    }
    failAuthentication() {
        this.response.status(401).json(new ResponseModel(undefined, "Unauthorized access"));
    }
    failBadRequest() {
        this.response.status(400).json(new ResponseModel(undefined, "Bad request"));
    }
    failParam() {
        this.response.status(400).json(new ResponseModel(undefined, "Missing parameter"));
    }
    failUnknownRoute() {
        this.response.status(404).json(new ResponseModel(undefined, "Unknown route"));
    }
    failInternalError() {
        this.response.status(500).json(new ResponseModel(undefined, "An internal error occurred."));
    }
}
exports.ResponseSender = ResponseSender;
//# sourceMappingURL=ResponseModel.js.map