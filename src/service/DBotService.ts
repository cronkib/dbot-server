import { MessageActivity, VoiceActivity } from "../domain/ActivityModels";
import { AddRecordCallback, RecordsCallback } from "../dataaccess/DBotDao";

export default interface DBotService {
	addMessage(message: MessageActivity, callback: AddRecordCallback): void;
	addVoiceActivity(activity: VoiceActivity, callback: AddRecordCallback): void;
	getAllMessages(callback: RecordsCallback<MessageActivity>): void;
	getAllVoiceActivities(callback: RecordsCallback<VoiceActivity>): void;
}