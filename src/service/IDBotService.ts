import { IAddRecordCallback, IRecordsCallback } from "../dataaccess/IDBotDao";
import { MessageActivity, VoiceActivity } from "../domain/ActivityModels";

export default interface IDBotService {
	addMessage(message: MessageActivity, callback: IAddRecordCallback): void;
	addVoiceActivity(activity: VoiceActivity, callback: IAddRecordCallback): void;
	getAllMessages(callback: IRecordsCallback<MessageActivity>): void;
	getAllVoiceActivities(callback: IRecordsCallback<VoiceActivity>): void;
}
