import config from "../config.json";
import { DatabaseType, DatabaseTypeConvert } from "./model/DatabaseType";

interface IDatabaseConfig {
	type: DatabaseType;
	user?: string;
	host?: string;
	database?: string;
	password?: string;
	port?: number;
	path?: string;
}

class Config {
	public discordToken: string;
	public port: number;
	public database: IDatabaseConfig;

	constructor() {
		this.discordToken = config.discordToken;
		this.port = config.port;
		this.database = {
			type: DatabaseTypeConvert(config.database.type),
			user: config.database.user,
			host: config.database.host,
			database: config.database.database,
			password: config.database.password,
			port: config.database.port,
			path: config.database.path,
		};
	}

	public getPostgresPoolConfig() {
		return {
			user: this.database.user,
			host: this.database.host,
			database: this.database.database,
			password: this.database.password,
			port: this.database.port,
		};
	}
}

export default new Config();
