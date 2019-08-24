import { RunResult } from "sqlite3";
import { ChannelCount, MessageActivity, VoiceActivity } from "../domain/ActivityModels";

export default interface IDBotDao {
	addMessageActivity(message: MessageActivity, callback: IAddRecordCallback): void;
	addVoiceActivity(activity: VoiceActivity, callback: IAddRecordCallback): void;
	getAllMessages(callback: IRecordsCallback<MessageActivity>): void;
	getAllVoiceActivities(callback: IRecordsCallback<VoiceActivity>);
	getChannelMessageCounts(callback: IRecordsCallback<ChannelCount>);
	getChannelConnectionCounts(callback: IRecordsCallback<ChannelCount>);
}

export interface IAddRecordCallback {
	onData(): void;
	onError(error: Error): void;
}

export interface IRecordsCallback<T> {
	onData(records: T[]): void;
	onError(error: Error): void;
}

export function AdaptAddRecordCallback(callback: IAddRecordCallback): (result: RunResult, error: Error) => void {
	return (result: RunResult, error: Error): void => {
		if (error) {
			return callback.onError(error);
		}
		callback.onData();
	};
}

export function AdaptRowMapping<T>(mapper: (rows: any[]) => T[], callback: IRecordsCallback<T>):
	(error: Error, rows: any) => void {
	return (error: Error, rows: any): void => {
		if (error) {
			return callback.onError(error);
		}

		const mappedRecords = mapper(rows);
		callback.onData(mappedRecords);
	};
}
