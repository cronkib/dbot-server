"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("./src/Config"));
const DiscordConnector_1 = __importDefault(require("./src/DiscordConnector"));
const ExpressApp_1 = require("./src/ExpressApp");
const SqliteDBotDao_1 = __importDefault(require("./src/dataaccess/SqliteDBotDao"));
const DefaultDBotService_1 = __importDefault(require("./src/service/DefaultDBotService"));
const DBotController_1 = __importDefault(require("./src/controller/DBotController"));
class App {
    constructor() {
        this.loadServices();
        this.connectToDiscord();
    }
    connectToDiscord() {
        const service = this.dbotService;
        const discordConnector = new DiscordConnector_1.default(Config_1.default.discordToken);
        discordConnector.connect();
        discordConnector.onMessageReceived({
            onMessageReceived: message => {
                console.log("Received Message( " + message.username + "): " + message.content);
                service.addMessage(message, {
                    onData: () => {
                        console.log("Added message");
                    },
                    onError: (error) => {
                        console.log(error);
                    }
                });
            }
        }).onVoiceActivityChanged({
            onVoiceEventReceived: voiceEvent => {
                console.log("Voice Event (" + voiceEvent.username + "): " + voiceEvent.event);
                service.addVoiceActivity(voiceEvent, {
                    onData: () => {
                        console.log("Added voice activity");
                    },
                    onError: (error) => {
                        console.log(error);
                    }
                });
            }
        });
    }
    loadServices() {
        this.dbotDao = new SqliteDBotDao_1.default();
        this.dbotService = new DefaultDBotService_1.default(this.dbotDao);
        this.dbotController = new DBotController_1.default(this.dbotService);
        ExpressApp_1.ExpressApp.listen(Config_1.default.port, () => {
            console.log(`Listening on port ${Config_1.default.port}`);
        });
    }
}
new App();
//# sourceMappingURL=app.js.map