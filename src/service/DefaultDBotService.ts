import { IAddRecordCallback, IRecordsCallback } from "../dataaccess/IDBotDao";
import IDBotDao from "../dataaccess/IDBotDao";
import { MessageActivity, VoiceActivity } from "../domain/ActivityModels";
import IDBotService from "./IDBotService";

export default class DefaultDBotService implements IDBotService {
	constructor(private dbotDao: IDBotDao) { }

	public addMessage(message: MessageActivity, callback: IAddRecordCallback): void {
		this.dbotDao.addMessageActivity(message, callback);
	}

	public addVoiceActivity(activity: VoiceActivity, callback: IAddRecordCallback): void {
		this.dbotDao.addVoiceActivity(activity, callback);
	}

	public getAllMessages(callback: IRecordsCallback<MessageActivity>): void {
		this.dbotDao.getAllMessages(callback);
	}

	public getAllVoiceActivities(callback: IRecordsCallback<VoiceActivity>): void {
		this.dbotDao.getAllVoiceActivities(callback);
	}
}
