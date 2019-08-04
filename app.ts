import Config  from "./src/Config";
import DiscordConnector from "./src/DiscordConnector";
import { ExpressApp } from "./src/ExpressApp";
import SqliteDBotDao from "./src/dataaccess/SqliteDBotDao";
import DefaultDBotService from "./src/service/DefaultDBotService";
import DBotController from "./src/controller/DBotController";
import DBotDao from "./src/dataaccess/DBotDao";
import DBotService from "./src/service/DBotService";

class App {
	private dbotDao: DBotDao;
	private dbotService: DBotService;
	private dbotController: DBotController;

	constructor() {
		this.loadServices();
		this.connectToDiscord();
	}

	private connectToDiscord() {
		const service = this.dbotService;

		const discordConnector = new DiscordConnector(Config.discordToken);
		discordConnector.connect();
		discordConnector.onMessageReceived({
			onMessageReceived: message => {
				console.log("Received Message( " + message.username + "): " + message.content);

				service.addMessage(message, {
					onData: () => {
						console.log("Added message");
					},

					onError: (error: Error) => {
						console.log(error);
					}
				});
			}
		}).onVoiceActivityChanged({
			onVoiceEventReceived: voiceEvent => {
				console.log("Voice Event (" + voiceEvent.username + "): " + voiceEvent.event);
				service.addVoiceActivity(voiceEvent, {
					onData: () => {
						console.log("Added voice activity");
					},

					onError: (error: Error) => {
						console.log(error);
					}
				});
			}
		});
	}

	private loadServices() {
		this.dbotDao = new SqliteDBotDao();
		this.dbotService = new DefaultDBotService(this.dbotDao);
		this.dbotController = new DBotController(this.dbotService);

		ExpressApp.listen(Config.port, () => {
			console.log(`Listening on port ${Config.port}`);
		});
	}
}

new App();