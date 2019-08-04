import { Database } from "sqlite3";

export class DatabaseFactory {
	static createSqliteDatabase(path: string) {
		let messageInitSql = " " +
			"create table message_activity_log ( " +
			"    id integer primary key autoincrement, " +
			"    content text not null, " +
			"    channel text not null, " +
			"    username text not null, " +
			"    insert_timestamp timestamp not null default current_timestamp " +
			") ";
		let voiceInitSql = " " +
			"create table voice_activity_log ( " +
			"    id integer primary key autoincrement, " +
			"    username text not null, " +
			"    channel text not null, " +
			"    event text not null, " +
			"    insert_timestamp timestamp not null default current_timestamp " +
			") ";
		
		let db = new Database(path);
		db.serialize(() => {
			db.run(messageInitSql);
			db.run(voiceInitSql);
		});

		return db;
	}	
}

export class DatabaseContainer {
	sqliteDatabase: Database;

	constructor() {
		this.sqliteDatabase = DatabaseFactory.createSqliteDatabase(":memory:");
	}

	getSqlite() {
		return this.sqliteDatabase;
	}
}

export const DB = {
	currentSession: new DatabaseContainer().sqliteDatabase
}