"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ExpressController_1 = __importDefault(require("./ExpressController"));
class DBotController extends ExpressController_1.default {
    constructor(dbotService) {
        super();
        this.dbotService = dbotService;
        super.route("")
            .get("/messageActivities", this.getMessages(this.dbotService))
            .get("/voiceActivities", this.getVoiceActivities(this.dbotService))
            .done();
    }
    getMessages(dbotService) {
        return (req, res) => {
            dbotService.getAllMessages({
                onData: (messages) => {
                    res.send(messages);
                },
                onError: (error) => {
                    res.status(500).send(error);
                }
            });
        };
    }
    getVoiceActivities(dbotService) {
        return (req, res) => {
            dbotService.getAllVoiceActivities({
                onData: (messages) => {
                    res.send(messages);
                },
                onError: (error) => {
                    res.status(500).send(error);
                }
            });
        };
    }
}
exports.default = DBotController;
//# sourceMappingURL=DBotController.js.map