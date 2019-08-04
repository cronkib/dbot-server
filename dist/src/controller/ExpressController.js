"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ExpressApp_1 = require("../ExpressApp");
const bodyParser = require("body-parser");
class ExpressController {
    constructor() {
        this.router = express_1.default.Router();
        this.routeHandlers = [bodyParser.json()];
    }
    route(prefix) {
        this.prefix = prefix;
        return this;
    }
    get(url, handler) {
        this.router.get(url, handler);
        return this;
    }
    ;
    put(url, handler) {
        this.router.put(url, this.routeHandlers, handler);
        return this;
    }
    ;
    delete(url, handler) {
        this.router.delete(url, this.routeHandlers, handler);
        return this;
    }
    ;
    post(url, handler) {
        this.router.post(url, this.routeHandlers, handler);
        return this;
    }
    ;
    routeAll(handler) {
        this.router.all("*", handler);
        return this;
    }
    done() {
        ExpressApp_1.ExpressApp.use(this.prefix, this.router);
    }
}
exports.default = ExpressController;
//# sourceMappingURL=ExpressController.js.map