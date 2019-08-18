import Config from "./src/Config";
import DBotController from "./src/controller/DBotController";
import IDBotDao from "./src/dataaccess/IDBotDao";
import PostgresDBotDao from "./src/dataaccess/PostgresDBotDao";
import SqliteDBotDao from "./src/dataaccess/SqliteDBotDao";
import { DB } from "./src/Database";
import DiscordConnector from "./src/DiscordConnector";
import { ExpressApp } from "./src/ExpressApp";
import { DatabaseType } from "./src/model/DatabaseType";
import DBotService from "./src/service/IDBotService";
import DefaultDBotService from "./src/service/DefaultDBotService";

class App {
	private dbotDao: IDBotDao;
	private dbotService: DBotService;
	private dbotController: DBotController;

	public start() {
		this.loadServices();
		this.connectToDiscord();
		this.connectToDatabase();
	}

	private connectToDiscord() {
		const service = this.dbotService;

		const discordConnector = new DiscordConnector(Config.discordToken);
		discordConnector.connect();
		discordConnector.onMessageReceived({
			onMessageReceived: (message) => {
				console.log("Received Message( " + message.username + "): " + message.content);

				service.addMessage(message, {
					onData: () => {
						console.log("Added message");
					},

					onError: (error: Error) => {
						console.log(error);
					},
				});
			},
		}).onVoiceActivityChanged({
			onVoiceEventReceived: (voiceEvent) => {
				console.log("Voice Event (" + voiceEvent.username + "): " + voiceEvent.event);
				service.addVoiceActivity(voiceEvent, {
					onData: () => {
						console.log("Added voice activity");
					},

					onError: (error: Error) => {
						console.log(error);
					},
				});
			},
		});
	}

	private loadServices() {
		if (Config.database.type === DatabaseType.Postgresql) {
			this.dbotDao = new PostgresDBotDao();
		}
		else if (Config.database.type === DatabaseType.Sqlite) {
			this.dbotDao = new SqliteDBotDao();
		}
		else {
			console.log("Unknown database type");
			return;
		}

		this.dbotService = new DefaultDBotService(this.dbotDao);
		this.dbotController = new DBotController(this.dbotService);

		ExpressApp.listen(Config.port, () => {
			console.log(`Listening on port ${Config.port}`);
		});
	}

	private connectToDatabase() {
		DB.init();
	}
}

new App().start();
