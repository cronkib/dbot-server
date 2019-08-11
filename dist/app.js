"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("./src/Config"));
const DBotController_1 = __importDefault(require("./src/controller/DBotController"));
const PostgresDBotDao_1 = __importDefault(require("./src/dataaccess/PostgresDBotDao"));
const SqliteDBotDao_1 = __importDefault(require("./src/dataaccess/SqliteDBotDao"));
const Database_1 = require("./src/Database");
const DiscordConnector_1 = __importDefault(require("./src/DiscordConnector"));
const ExpressApp_1 = require("./src/ExpressApp");
const DatabaseType_1 = require("./src/model/DatabaseType");
const DefaultDBotService_1 = __importDefault(require("./src/service/DefaultDBotService"));
class App {
    start() {
        this.loadServices();
        this.connectToDiscord();
        this.connectToDatabase();
    }
    connectToDiscord() {
        const service = this.dbotService;
        const discordConnector = new DiscordConnector_1.default(Config_1.default.discordToken);
        discordConnector.connect();
        discordConnector.onMessageReceived({
            onMessageReceived: (message) => {
                console.log("Received Message( " + message.username + "): " + message.content);
                service.addMessage(message, {
                    onData: () => {
                        console.log("Added message");
                    },
                    onError: (error) => {
                        console.log(error);
                    },
                });
            },
        }).onVoiceActivityChanged({
            onVoiceEventReceived: (voiceEvent) => {
                console.log("Voice Event (" + voiceEvent.username + "): " + voiceEvent.event);
                service.addVoiceActivity(voiceEvent, {
                    onData: () => {
                        console.log("Added voice activity");
                    },
                    onError: (error) => {
                        console.log(error);
                    },
                });
            },
        });
    }
    loadServices() {
        if (Config_1.default.database.type === DatabaseType_1.DatabaseType.Postgresql) {
            this.dbotDao = new PostgresDBotDao_1.default();
        }
        else if (Config_1.default.database.type === DatabaseType_1.DatabaseType.Sqlite) {
            this.dbotDao = new SqliteDBotDao_1.default();
        }
        else {
            console.log("Unknown database type");
            return;
        }
        this.dbotService = new DefaultDBotService_1.default(this.dbotDao);
        this.dbotController = new DBotController_1.default(this.dbotService);
        ExpressApp_1.ExpressApp.listen(Config_1.default.port, () => {
            console.log(`Listening on port ${Config_1.default.port}`);
        });
    }
    connectToDatabase() {
        Database_1.DB.init();
    }
}
new App().start();
//# sourceMappingURL=app.js.map