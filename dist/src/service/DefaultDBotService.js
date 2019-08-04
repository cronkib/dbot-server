"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DefaultDBotService {
    constructor(dbotDao) {
        this.dbotDao = dbotDao;
    }
    addMessage(message, callback) {
        this.dbotDao.addMessageActivity(message, callback);
    }
    addVoiceActivity(activity, callback) {
        this.dbotDao.addVoiceActivity(activity, callback);
    }
    getAllMessages(callback) {
        this.dbotDao.getAllMessages(callback);
    }
    getAllVoiceActivities(callback) {
        this.dbotDao.getAllVoiceActivities(callback);
    }
}
exports.default = DefaultDBotService;
//# sourceMappingURL=DefaultDBotService.js.map