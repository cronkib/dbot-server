"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ResponseModel_1 = __importDefault(require("./ResponseModel"));
class ResponseSender {
    constructor(response) {
        this.response = response;
        this.response = response;
    }
    send(data) {
        this.response.json(new ResponseModel_1.default(data));
    }
    failAuthentication() {
        this.response.status(401).json(new ResponseModel_1.default(undefined, "Unauthorized access"));
    }
    failBadRequest() {
        this.response.status(400).json(new ResponseModel_1.default(undefined, "Bad request"));
    }
    failParam() {
        this.response.status(400).json(new ResponseModel_1.default(undefined, "Missing parameter"));
    }
    failUnknownRoute() {
        this.response.status(404).json(new ResponseModel_1.default(undefined, "Unknown route"));
    }
    failInternalError() {
        this.response.status(500).json(new ResponseModel_1.default(undefined, "An internal error occurred."));
    }
}
exports.ResponseSender = ResponseSender;
//# sourceMappingURL=ResponseSender.js.map