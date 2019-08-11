"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const sqlite3_1 = require("sqlite3");
const Config_1 = __importDefault(require("./Config"));
const DatabaseType_1 = require("./model/DatabaseType");
class DatabaseContainer {
    constructor() {
        if (Config_1.default.database.type === DatabaseType_1.DatabaseType.Postgresql) {
            this.postgres = new pg_1.Pool(Config_1.default.getPostgresPoolConfig());
        }
        else if (Config_1.default.database.type === DatabaseType_1.DatabaseType.Sqlite) {
            this.sqlite = new sqlite3_1.Database(Config_1.default.database.path);
        }
        else {
            throw new Error("Error creating database. Invalid DatabaseType.");
        }
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (Config_1.default.database.type === DatabaseType_1.DatabaseType.Postgresql) {
                    yield this.createPostgresDatabase();
                }
                else if (Config_1.default.database.type === DatabaseType_1.DatabaseType.Sqlite) {
                    this.createSqliteDatabase();
                }
                else {
                    throw new Error("Error creating database. Invalid DatabaseType.");
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    createPostgresDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            const schemaInitSql = " CREATE SCHEMA if not exists main AUTHORIZATION " + Config_1.default.database.user;
            const messageInitSql = " " +
                "create table if not exists main.message_activity_log ( " +
                "    id bigserial primary key, " +
                "    content text not null, " +
                "    channel varchar(256) not null, " +
                "    username varchar(256) not null, " +
                "    insert_timestamp timestamptz not null default current_timestamp " +
                ") ";
            const voiceInitSql = " " +
                "create table if not exists main.voice_activity_log ( " +
                "    id bigserial primary key, " +
                "    username varchar(256) not null, " +
                "    channel varchar(256) not null, " +
                "    event varchar(32) not null, " +
                "    insert_timestamp timestamptz not null default current_timestamp " +
                ") ";
            const client = yield this.postgres.connect();
            try {
                yield client.query("begin");
                yield client.query(schemaInitSql);
                yield client.query(messageInitSql);
                yield client.query(voiceInitSql);
                yield client.query("commit");
            }
            catch (error) {
                console.log(error);
                yield client.query("rollback");
            }
            finally {
                client.release();
            }
        });
    }
    createSqliteDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            const messageInitSql = " " +
                "create table message_activity_log ( " +
                "    id integer primary key autoincrement, " +
                "    content text not null, " +
                "    channel text not null, " +
                "    username text not null, " +
                "    insert_timestamp timestamp not null default current_timestamp " +
                ") ";
            const voiceInitSql = " " +
                "create table voice_activity_log ( " +
                "    id integer primary key autoincrement, " +
                "    username text not null, " +
                "    channel text not null, " +
                "    event text not null, " +
                "    insert_timestamp timestamp not null default current_timestamp " +
                ") ";
            return new Promise((resolve, reject) => {
                const db = this.sqlite;
                db.serialize(() => {
                    db.run(messageInitSql, (messageResult, messageError) => {
                        if (messageError) {
                            reject(messageError);
                            return;
                        }
                        db.run(voiceInitSql, (voiceResult, voiceError) => {
                            if (voiceError) {
                                reject(voiceError);
                                return;
                            }
                            resolve();
                        });
                    });
                });
            });
        });
    }
}
exports.DatabaseContainer = DatabaseContainer;
exports.DB = new DatabaseContainer();
//# sourceMappingURL=Database.js.map