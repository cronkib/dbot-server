"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = require("../Database");
const addMessageSql = " insert into main.message_activity_log ( content, channel, username ) values ( $1, $2, $3 ) ";
const getAllMessagesSql = "select id, content, channel, username, insert_timestamp from main.message_activity_log";
const addVoiceActivitySql = " insert into main.voice_activity_log ( username, channel, event ) values ( $1, $2, $3 ) ";
const getAllVoiceActivitiesSql = "select id, username, insert_timestamp, event, channel from main.voice_activity_log";
const getChannelMessageCountsSql = " " +
    " select channel, channel_count, " +
    "	(select max(insert_timestamp) " +
    "	from main.message_activity_log mal " +
    "	where sq.channel = mal.channel " +
    "	) as last_message " +
    "from ( " +
    "	select channel, count(*) as channel_count " +
    "	from main.message_activity_log " +
    "	where insert_timestamp > now() - interval '30 days' " +
    "	group by channel " +
    ") sq " +
    "order by channel_count desc " +
    "limit 10 ";
const getChannelConnectionCountsSql = " " +
    " select channel, channel_count, " +
    "	(select max(insert_timestamp) " +
    "	from main.voice_activity_log mal " +
    "	where sq.channel = mal.channel " +
    "	) as last_message " +
    "from ( " +
    "	select channel, count(*) as channel_count " +
    "	from main.voice_activity_log " +
    "	where insert_timestamp > now() - interval '30 days' " +
    "	and event = 'connected' " +
    "	group by channel " +
    ") sq " +
    "order by channel_count desc " +
    "limit 10 ";
class PostgresDBotDao {
    addMessageActivity(message, callback) {
        Database_1.DB.postgres.connect()
            .then((client) => {
            client.query(addMessageSql, [message.content, message.channel, message.username])
                .then(() => {
                client.release();
                callback.onData();
            }).catch((reason) => {
                client.release();
                callback.onError(reason);
            });
        }).catch((reason) => {
            callback.onError(reason);
        });
    }
    addVoiceActivity(activity, callback) {
        Database_1.DB.postgres.connect()
            .then((client) => {
            client.query(addVoiceActivitySql, [activity.username, activity.channel, activity.event])
                .then(() => {
                client.release();
                callback.onData();
            }).catch((reason) => {
                client.release();
                callback.onError(reason);
            });
        }).catch((reason) => {
            callback.onError(reason);
        });
    }
    getAllMessages(callback) {
        Database_1.DB.postgres.connect()
            .then((client) => {
            client.query(getAllMessagesSql, [])
                .then((result) => {
                const messages = result.rows.map((r) => {
                    return {
                        id: r.id,
                        content: r.content,
                        channel: r.channel,
                        username: r.username,
                        timestamp: r.insert_timestamp
                    };
                });
                client.release();
                callback.onData(messages);
            }).catch((reason) => {
                client.release();
                callback.onError(reason);
            });
        }).catch((reason) => {
            callback.onError(reason);
        });
    }
    getAllVoiceActivities(callback) {
        Database_1.DB.postgres.connect()
            .then((client) => {
            client.query(getAllVoiceActivitiesSql, [])
                .then((result) => {
                const activities = result.rows.map((r) => {
                    return {
                        id: r.id,
                        username: r.username,
                        event: r.event,
                        channel: r.channel,
                        timestamp: r.insert_timestamp
                    };
                });
                client.release();
                callback.onData(activities);
            }).catch((reason) => {
                client.release();
                callback.onError(reason);
            });
        }).catch((reason) => {
            callback.onError(reason);
        });
    }
    getChannelMessageCounts(callback) {
        this.getCounts(getChannelMessageCountsSql, callback);
    }
    getChannelConnectionCounts(callback) {
        this.getCounts(getChannelConnectionCountsSql, callback);
    }
    getCounts(sql, callback) {
        Database_1.DB.postgres.connect()
            .then((client) => {
            client.query(sql, [])
                .then((result) => {
                const counts = result.rows.map((r) => {
                    return {
                        channel: r.channel,
                        count: r.channel_count,
                        lastMessage: r.last_message
                    };
                });
                client.release();
                callback.onData(counts);
            }).catch((reason) => {
                client.release();
                callback.onError(reason);
            });
        }).catch((reason) => {
            callback.onError(reason);
        });
    }
}
exports.default = PostgresDBotDao;
//# sourceMappingURL=PostgresDBotDao.js.map