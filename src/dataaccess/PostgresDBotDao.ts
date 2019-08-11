import { PoolClient, QueryResult } from "pg";
import { DB } from "../Database";
import { MessageActivity, VoiceActivity } from "../domain/ActivityModels";
import DBotDao, { AddRecordCallback, RecordsCallback } from "./DBotDao";

const addMessageSql = " insert into main.message_activity_log ( content, channel, username ) values ( $1, $2, $3 ) ";
const getAllMessagesSql = "select id, content, channel, username, insert_timestamp from main.message_activity_log";
const addVoiceActivitySql = " insert into main.voice_activity_log ( username, channel, event ) values ( $1, $2, $3 ) ";
const getAllVoiceActivitiesSql = "select id, username, insert_timestamp, event, channel from main.voice_activity_log";

export default class PostgresDBotDao implements DBotDao {
	public addMessageActivity(message: MessageActivity, callback: AddRecordCallback): void {
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

	public addVoiceActivity(activity: VoiceActivity, callback: AddRecordCallback): void {
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

	public getAllMessages(callback: RecordsCallback<MessageActivity>): void {
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

	public getAllVoiceActivities(callback: RecordsCallback<VoiceActivity>) {
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
}
