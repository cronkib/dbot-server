import express from "express";
import { MessageActivity, VoiceActivity } from "../domain/ActivityModels";
import DBotService from "../service/IDBotService";
import ExpressController from "./ExpressController";

export default class DBotController extends ExpressController {
	constructor(private dbotService: DBotService) {
		super();
		super.route("")
			.get("/messageActivities", this.getMessages(this.dbotService))
			.get("/voiceActivities", this.getVoiceActivities(this.dbotService))
			.done();
	}

	public getMessages(dbotService: DBotService) {
		return (req: express.Request, res: express.Response): any => {
			dbotService.getAllMessages({
				onData: (messages: MessageActivity[]): void => {
					res.send(messages);
				},

				onError: (error: Error): void => {
					console.log(error);
					res.status(500).send(error);
				}
			});
		};
	}

	public getVoiceActivities(dbotService: DBotService) {
		return (req: express.Request, res: express.Response): any => {
			dbotService.getAllVoiceActivities({
				onData: (messages: VoiceActivity[]): void => {
					res.send(messages);
				},

				onError: (error: Error): void => {
					console.log(error);
					res.status(500).send(error);
				}
			});
		};
	}
}