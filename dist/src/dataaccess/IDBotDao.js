"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function AdaptAddRecordCallback(callback) {
    return (result, error) => {
        if (error) {
            return callback.onError(error);
        }
        callback.onData();
    };
}
exports.AdaptAddRecordCallback = AdaptAddRecordCallback;
function AdaptRowMapping(mapper, callback) {
    return (error, rows) => {
        if (error) {
            return callback.onError(error);
        }
        let mappedRecords = mapper(rows);
        callback.onData(mappedRecords);
    };
}
exports.AdaptRowMapping = AdaptRowMapping;
//# sourceMappingURL=IDBotDao.js.map