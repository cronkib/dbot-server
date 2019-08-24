import { PoolClient, QueryResult } from "pg";
import { DB } from "../Database";
import { MessageActivity, VoiceActivity, ChannelCount } from "../domain/ActivityModels";
import IDBotDao, { IAddRecordCallback, IRecordsCallback } from "./IDBotDao";

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

export default class PostgresDBotDao implements IDBotDao {
	public addMessageActivity(message: MessageActivity, callback: IAddRecordCallback): void {
		DB.postgres.connect()
			.then((client: PoolClient) => {
				client.query(addMessageSql, [message.content, message.channel, message.username])
					.then(() => {
						client.release();
						callback.onData();
					}).catch((reason: any) => {
						client.release();
						callback.onError(reason);
					});
			}).catch((reason: any) => {
				callback.onError(reason);
			});
	}

	public addVoiceActivity(activity: VoiceActivity, callback: IAddRecordCallback): void {
		DB.postgres.connect()
			.then((client: PoolClient) => {
				client.query(addVoiceActivitySql, [activity.username, activity.channel, activity.event])
					.then(() => {
						client.release();
						callback.onData();
					}).catch((reason: any) => {
						client.release();
						callback.onError(reason);
					});
			}).catch((reason: any) => {
				callback.onError(reason);
			});
	}

	public getAllMessages(callback: IRecordsCallback<MessageActivity>): void {
		DB.postgres.connect()
			.then((client: PoolClient) => {
				client.query(getAllMessagesSql, [])
					.then((result: QueryResult) => {
						const messages: MessageActivity[] = result.rows.map((r) => {
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
					}).catch((reason: any) => {
						client.release();
						callback.onError(reason);
					});
			}).catch((reason: any) => {
				callback.onError(reason);
			});
	}

	public getAllVoiceActivities(callback: IRecordsCallback<VoiceActivity>) {
		DB.postgres.connect()
			.then((client: PoolClient) => {
				client.query(getAllVoiceActivitiesSql, [])
					.then((result: QueryResult) => {
						const activities: VoiceActivity[] = result.rows.map((r) => {
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
					}).catch((reason: any) => {
						client.release();
						callback.onError(reason);
					});
			}).catch((reason: any) => {
				callback.onError(reason);
			});
	}

	public getChannelMessageCounts(callback: IRecordsCallback<ChannelCount>) {
		this.getCounts(getChannelMessageCountsSql, callback);
	}

	public getChannelConnectionCounts(callback: IRecordsCallback<ChannelCount>) {
		this.getCounts(getChannelConnectionCountsSql, callback);
	}

	private getCounts(sql: string, callback: IRecordsCallback<ChannelCount>) {
		DB.postgres.connect()
			.then((client: PoolClient) => {
				client.query(sql, [])
					.then((result: QueryResult) => {
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
			}).catch((reason: any) => {
				callback.onError(reason);
			});
	}
}
