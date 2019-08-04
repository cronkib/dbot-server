"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DBotDao_1 = require("./DBotDao");
const Database_1 = require("../Database");
const addMessageSql = " insert into message_activity_log ( content, channel, username ) values ( ?, ?, ? ) ";
const getAllMessagesSql = "select id, content, channel, username, insert_timestamp from message_activity_log";
const addVoiceActivitySql = " insert into voice_activity_log ( username, channel, event ) values ( ?, ?, ? ) ";
const getAllVoiceActivitiesSql = "select id, username, insert_timestamp, event, channel from voice_activity_log";
class SqliteDBotDao {
    constructor() { }
    addMessageActivity(message, callback) {
        Database_1.DB.currentSession.serialize(() => {
            Database_1.DB.currentSession.run(addMessageSql, [
                message.content,
                message.channel,
                message.username
            ], DBotDao_1.AdaptAddRecordCallback(callback));
        });
    }
    addVoiceActivity(activity, callback) {
        Database_1.DB.currentSession.serialize(() => {
            Database_1.DB.currentSession.run(addVoiceActivitySql, [
                activity.username,
                activity.channel,
                activity.event
            ], DBotDao_1.AdaptAddRecordCallback(callback));
        });
    }
    getAllMessages(callback) {
        Database_1.DB.currentSession.serialize(() => {
            Database_1.DB.currentSession.all(getAllMessagesSql, [], DBotDao_1.AdaptRowMapping((rows) => {
                return rows.map((r) => {
                    return {
                        id: r.id,
                        content: r.content,
                        channel: r.channel,
                        username: r.username,
                        timestamp: r.insert_timestamp
                    };
                });
            }, callback));
        });
    }
    getAllVoiceActivities(callback) {
        Database_1.DB.currentSession.serialize(() => {
            Database_1.DB.currentSession.all(getAllVoiceActivitiesSql, [], DBotDao_1.AdaptRowMapping((rows) => {
                return rows.map((r) => {
                    return {
                        id: r.id,
                        username: r.username,
                        timestamp: r.insert_timestamp,
                        event: r.event,
                        channel: r.channel
                    };
                });
            }, callback));
        });
    }
}
exports.default = SqliteDBotDao;
//# sourceMappingURL=SqliteDBotDao.js.map