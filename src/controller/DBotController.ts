import DBotService from "../service/DBotService";
import ExpressController from "./ExpressController";
import { MessageActivity, VoiceActivity } from "../domain/ActivityModels";
import express from "express";
import { Message } from "discord.js";

export default class DBotController extends ExpressController {
	constructor(private dbotService: DBotService) {
		super();
		super.route("")
			.get("/messageActivities", this.getMessages(this.dbotService))
			.get("/voiceActivities", this.getVoiceActivities(this.dbotService))
			.done();
	}

	getMessages(dbotService: DBotService) {
		return (req: express.Request, res: express.Response): any => {
			dbotService.getAllMessages({
				onData: (messages: MessageActivity[]): void => {
					res.send(messages);
				},

				onError: (error: Error): void => {
					res.status(500).send(error);
				}
			});
		};
	}

	getVoiceActivities(dbotService: DBotService) {
		return (req: express.Request, res: express.Response): any => {
			dbotService.getAllVoiceActivities({
				onData: (messages: VoiceActivity[]): void => {
					res.send(messages);
				},

				onError: (error: Error): void => {
					res.status(500).send(error);
				}
			});
		};
	}
}