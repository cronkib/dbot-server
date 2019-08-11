"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DatabaseType;
(function (DatabaseType) {
    DatabaseType["Postgresql"] = "postgresql";
    DatabaseType["Sqlite"] = "sqlite";
})(DatabaseType = exports.DatabaseType || (exports.DatabaseType = {}));
function DatabaseTypeConvert(value) {
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
exports.DatabaseTypeConvert = DatabaseTypeConvert;
//# sourceMappingURL=DatabaseType.js.map