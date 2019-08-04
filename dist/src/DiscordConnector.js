"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const ActivityModels_1 = require("./domain/ActivityModels");
class DiscordConnector {
    constructor(token) {
        this.token = token;
        this.token = token;
        this.client = new discord_js_1.default.Client();
    }
    connect() {
        this.client.login(this.token);
        this.listenForMessages();
        this.listenForVoiceChanges();
        return this;
    }
    onMessageReceived(handler) {
        this.messageHandler = handler;
        return this;
    }
    onVoiceActivityChanged(handler) {
        this.voiceEventHandler = handler;
        return this;
    }
    listenForMessages() {
        this.client.on("message", (rawMessage) => {
            if (this.messageHandler) {
                this.messageHandler.onMessageReceived({
                    content: rawMessage.content,
                    channel: rawMessage.channel["name"],
                    username: rawMessage.member.user.username,
                    timestamp: new Date()
                });
            }
        });
    }
    listenForVoiceChanges() {
        this.client.on("voiceStateUpdate", (oldMember, newMember) => {
            let oldChannel = oldMember.voiceChannel;
            let newChannel = newMember.voiceChannel;
            if (!oldChannel && newChannel && this.voiceEventHandler) {
                this.voiceEventHandler.onVoiceEventReceived({
                    username: oldMember.user.username,
                    timestamp: new Date(),
                    event: ActivityModels_1.VoiceEvent.CONNECTED,
                    channel: newChannel.name
                });
            }
            else if (oldChannel && !newChannel && this.voiceEventHandler) {
                this.voiceEventHandler.onVoiceEventReceived({
                    username: oldMember.user.username,
                    timestamp: new Date(),
                    event: ActivityModels_1.VoiceEvent.DISCONNECTED,
                    channel: oldChannel.name
                });
            }
            else if (this.voiceEventHandler && oldChannel.name !== newChannel.name) {
                this.voiceEventHandler.onVoiceEventReceived({
                    username: oldMember.user.username,
                    timestamp: new Date(),
                    event: ActivityModels_1.VoiceEvent.DISCONNECTED,
                    channel: oldChannel.name
                });
                this.voiceEventHandler.onVoiceEventReceived({
                    username: newMember.user.username,
                    timestamp: new Date(),
                    event: ActivityModels_1.VoiceEvent.CONNECTED,
                    channel: newChannel.name
                });
            }
        });
    }
}
exports.default = DiscordConnector;
//# sourceMappingURL=DiscordConnector.js.map