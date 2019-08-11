import { Pool } from "pg";
import { Database as SqliteDatabase, RunResult } from "sqlite3";
import Config from "./Config";
import { DatabaseType } from "./model/DatabaseType";

export class DatabaseContainer {
	public sqlite?: SqliteDatabase;
	public postgres?: Pool;

	constructor() {
		if (Config.database.type === DatabaseType.Postgresql) {
			this.postgres = new Pool(Config.getPostgresPoolConfig());
		}
		else if (Config.database.type === DatabaseType.Sqlite) {
			this.sqlite = new SqliteDatabase(Config.database.path);
		}
		else {
			throw new Error("Error creating database. Invalid DatabaseType.");
		}
	}

	public async init(): Promise<any> {
		try {
			if (Config.database.type === DatabaseType.Postgresql) {
				await this.createPostgresDatabase();
			}
			else if (Config.database.type === DatabaseType.Sqlite) {
				this.createSqliteDatabase();
			}
			else {
				throw new Error("Error creating database. Invalid DatabaseType.");
			}
		}
		catch (error) {
			throw error;
		}
	}

	private async createPostgresDatabase(): Promise<any> {
		const schemaInitSql = " CREATE SCHEMA if not exists main AUTHORIZATION " + Config.database.user;
		const messageInitSql = " " +
			"create table if not exists main.message_activity_log ( " +
			"    id bigserial primary key, " +
			"    content text not null, " +
			"    channel varchar(256) not null, " +
			"    username varchar(256) not null, " +
			"    insert_timestamp timestamptz not null default current_timestamp " +
			") ";
		const voiceInitSql = " " +
			"create table if not exists main.voice_activity_log ( " +
			"    id bigserial primary key, " +
			"    username varchar(256) not null, " +
			"    channel varchar(256) not null, " +
			"    event varchar(32) not null, " +
			"    insert_timestamp timestamptz not null default current_timestamp " +
			") ";

		const client = await this.postgres.connect();

		try {
			await client.query("begin");
			await client.query(schemaInitSql);
			await client.query(messageInitSql);
			await client.query(voiceInitSql);
			await client.query("commit");
		}
		catch (error) {
			console.log(error);
			await client.query("rollback");
		}
		finally {
			client.release();
		}
	}

	private async createSqliteDatabase(): Promise<any> {
		const messageInitSql = " " +
			"create table message_activity_log ( " +
			"    id integer primary key autoincrement, " +
			"    content text not null, " +
			"    channel text not null, " +
			"    username text not null, " +
			"    insert_timestamp timestamp not null default current_timestamp " +
			") ";
		const voiceInitSql = " " +
			"create table voice_activity_log ( " +
			"    id integer primary key autoincrement, " +
			"    username text not null, " +
			"    channel text not null, " +
			"    event text not null, " +
			"    insert_timestamp timestamp not null default current_timestamp " +
			") ";

		return new Promise((resolve, reject) => {
			const db = this.sqlite;
			db.serialize(() => {
				db.run(messageInitSql, (messageResult: RunResult, messageError: Error) => {
					if (messageError) {
						reject(messageError);
						return;
					}

					db.run(voiceInitSql, (voiceResult: RunResult, voiceError: Error) => {
						if (voiceError) {
							reject(voiceError);
							return;
						}
						resolve();
					});
				});
			});
		});
	}
}

export const DB = new DatabaseContainer();
