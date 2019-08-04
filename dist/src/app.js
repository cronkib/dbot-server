"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("./Config"));
const DiscordConnector_1 = __importDefault(require("./DiscordConnector"));
const DefaultDBotService_1 = __importDefault(require("./service/DefaultDBotService"));
const ExpressApp_1 = require("./ExpressApp");
class App {
    constructor() {
        this.connectToDiscord();
    }
    connectToDiscord() {
        let discordConnector = new DiscordConnector_1.default(Config_1.default.discordToken);
        discordConnector.connect();
        discordConnector.onMessageReceived({
            onMessageReceived: message => {
                console.log(message);
            }
        }).onVoiceActivityChanged({
            onVoiceEventReceived: voiceEvent => {
                console.log(voiceEvent);
            }
        });
    }
    loadServices() {
        new DefaultDBotService_1.default();
        ExpressApp_1.ExpressApp.listen(Config_1.default.port, () => {
            console.log(`Listening on port ${Config_1.default.port}`);
        });
    }
}
new App();
//# sourceMappingURL=app.js.map