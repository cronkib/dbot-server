export enum DatabaseType {
	Postgresql = "postgresql", Sqlite = "sqlite",
}

export function DatabaseTypeConvert(value: string) {
	if (value === DatabaseType.Postgresql) {
		return DatabaseType.Postgresql;
	}
	else if (value === DatabaseType.Sqlite) {
		return DatabaseType.Sqlite;
	}
	else {
		return undefined;
	}
}
