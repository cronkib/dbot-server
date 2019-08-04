import { RunResult } from "sqlite3";
import { MessageActivity, VoiceActivity } from "../domain/ActivityModels";

export default interface DBotDao {
	addMessageActivity(message: MessageActivity, callback: AddRecordCallback): void;
	addVoiceActivity(activity: VoiceActivity, callback: AddRecordCallback): void;
	getAllMessages(callback: RecordsCallback<MessageActivity>): void;
	getAllVoiceActivities(callback: RecordsCallback<VoiceActivity>);
}

export interface AddRecordCallback {
	onData(): void;
	onError(error: Error): void;
}

export interface RecordsCallback<T> {
	onData(records: T[]): void;
	onError(error: Error): void;
}

export function AdaptAddRecordCallback(callback: AddRecordCallback): Function {
	return (result: RunResult, error: Error) => {
		if (error) {
			return callback.onError(error);
		}
		callback.onData();
	}
}

export function AdaptRowMapping<T>(mapper: (rows: any[]) => T[], callback: RecordsCallback<T>): Function {
	return (error: Error, rows: any) => {
		if (error) {
			return callback.onError(error);
		}

		let mappedRecords = mapper(rows);
		callback.onData(mappedRecords);
	}
}