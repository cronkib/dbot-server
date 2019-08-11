import { DB } from "../Database";
import { MessageActivity, VoiceActivity } from "../domain/ActivityModels";
import DBotDao, { AdaptAddRecordCallback, AdaptRowMapping, AddRecordCallback, RecordsCallback } from "./DBotDao";

const addMessageSql = " insert into message_activity_log ( content, channel, username ) values ( ?, ?, ? ) ";
const getAllMessagesSql = "select id, content, channel, username, insert_timestamp from message_activity_log";
const addVoiceActivitySql = " insert into voice_activity_log ( username, channel, event ) values ( ?, ?, ? ) ";
const getAllVoiceActivitiesSql = "select id, username, insert_timestamp, event, channel from voice_activity_log";

export default class SqliteDBotDao implements DBotDao {
	constructor() { }

	public addMessageActivity(message: MessageActivity, callback: AddRecordCallback): void {
		DB.sqlite.serialize(() => {
			DB.sqlite.run(addMessageSql, [
				message.content,
				message.channel,
				message.username,
			], AdaptAddRecordCallback(callback));
		});
	}

	public addVoiceActivity(activity: VoiceActivity, callback: AddRecordCallback): void {
		DB.sqlite.serialize(() => {
			DB.sqlite.run(addVoiceActivitySql, [
				activity.username,
				activity.channel,
				activity.event,
			], AdaptAddRecordCallback(callback));
		});
	}

	public getAllMessages(callback: RecordsCallback<MessageActivity>): void {
		DB.sqlite.serialize(() => {
			DB.sqlite.all(getAllMessagesSql, [], AdaptRowMapping((rows: any[]) => {
				return rows.map((r) => {
					return {
						id: r.id,
						content: r.content,
						channel: r.channel,
						username: r.username,
						timestamp: r.insert_timestamp,
					};
				});

			}, callback));
		});
	}

	public getAllVoiceActivities(callback: RecordsCallback<VoiceActivity>) {
		DB.sqlite.serialize(() => {
			DB.sqlite.all(getAllVoiceActivitiesSql, [], AdaptRowMapping((rows: any[]) => {
				return rows.map((r) => {
					return {
						id: r.id,
						username: r.username,
						timestamp: r.insert_timestamp,
						event: r.event,
						channel: r.channel,
					};
				});
			}, callback));
		});
	}
}
