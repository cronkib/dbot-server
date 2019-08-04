import DBotService from "./DBotService";
import { AddRecordCallback, RecordsCallback } from "../dataaccess/DBotDao";
import DBotDao from "../dataaccess/DBotDao";
import { MessageActivity, VoiceActivity } from "../domain/ActivityModels";
import { Message } from "discord.js";

export default class DefaultDBotService implements DBotService {
	constructor(private dbotDao: DBotDao) { }

	addMessage(message: MessageActivity, callback: AddRecordCallback): void {
		this.dbotDao.addMessageActivity(message, callback);
	}

	addVoiceActivity(activity: VoiceActivity, callback: AddRecordCallback): void {
		this.dbotDao.addVoiceActivity(activity, callback);
	}

	getAllMessages(callback: RecordsCallback<MessageActivity>): void {
		this.dbotDao.getAllMessages(callback);
	}

	getAllVoiceActivities(callback: RecordsCallback<VoiceActivity>): void {
		this.dbotDao.getAllVoiceActivities(callback);
	}
}