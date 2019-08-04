import config from "../config.json";

class Config {
	discordToken: string;
	port: number;

	constructor() {
		this.discordToken = config.discordToken;
		this.port = config.port;
	}
}

export default new Config();