"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = require("sqlite3");
class DatabaseFactory {
    static createSqliteDatabase(path) {
        let messageInitSql = " " +
            "create table message_activity_log ( " +
            "    id integer primary key autoincrement, " +
            "    content text not null, " +
            "    channel text not null, " +
            "    username text not null, " +
            "    insert_timestamp timestamp not null default current_timestamp " +
            ") ";
        let voiceInitSql = " " +
            "create table voice_activity_log ( " +
            "    id integer primary key autoincrement, " +
            "    username text not null, " +
            "    channel text not null, " +
            "    event text not null, " +
            "    insert_timestamp timestamp not null default current_timestamp " +
            ") ";
        let db = new sqlite3_1.Database(path);
        db.serialize(() => {
            db.run(messageInitSql);
            db.run(voiceInitSql);
        });
        return db;
    }
}
exports.DatabaseFactory = DatabaseFactory;
class DatabaseContainer {
    constructor() {
        this.sqliteDatabase = DatabaseFactory.createSqliteDatabase(":memory:");
    }
    getSqlite() {
        return this.sqliteDatabase;
    }
}
exports.DatabaseContainer = DatabaseContainer;
exports.DB = {
    currentSession: new DatabaseContainer().sqliteDatabase
};
//# sourceMappingURL=Database.js.map