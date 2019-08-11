"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = __importDefault(require("../config.json"));
const DatabaseType_1 = require("./model/DatabaseType");
class Config {
    constructor() {
        this.discordToken = config_json_1.default.discordToken;
        this.port = config_json_1.default.port;
        this.database = {
            type: DatabaseType_1.DatabaseTypeConvert(config_json_1.default.database.type),
            user: config_json_1.default.database.user,
            host: config_json_1.default.database.host,
            database: config_json_1.default.database.database,
            password: config_json_1.default.database.password,
            port: config_json_1.default.database.port,
            path: config_json_1.default.database.path,
        };
    }
    getPostgresPoolConfig() {
        return {
            user: this.database.user,
            host: this.database.host,
            database: this.database.database,
            password: this.database.password,
            port: this.database.port,
        };
    }
}
exports.default = new Config();
//# sourceMappingURL=Config.js.map