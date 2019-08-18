import Discord, { Client } from "discord.js";
import { MessageHandler, VoiceEventHandler, VoiceEvent } from "./domain/ActivityModels";

export default class DiscordConnector {
	private client: Client;
	private messageHandler: MessageHandler;
	private voiceEventHandler: VoiceEventHandler

	constructor(private token: string) {
		this.token = token;
		this.client = new Discord.Client();
	}

	public connect() {
		this.client.login(this.token);
		this.listenForMessages();
		this.listenForVoiceChanges();
		return this;
	}

	public onMessageReceived(handler: MessageHandler) {
		this.messageHandler = handler;
		return this;
	}

	public onVoiceActivityChanged(handler: VoiceEventHandler) {
		this.voiceEventHandler = handler;
		return this;
	}

	private listenForMessages() {
		this.client.on("message", (rawMessage) => {
			if (this.messageHandler) {
				this.messageHandler.onMessageReceived({
					content: rawMessage.content,
					channel: rawMessage.channel["name"] as string,
					username: rawMessage.member.user.username,
					timestamp: new Date()
				});
			}
		});
	}

	private listenForVoiceChanges() {
		this.client.on("voiceStateUpdate", (oldMember, newMember) => {
			let oldChannel = oldMember.voiceChannel;
			let newChannel = newMember.voiceChannel;

			if (!oldChannel && newChannel && this.voiceEventHandler) {
				this.voiceEventHandler.onVoiceEventReceived({
					username: oldMember.user.username,
					timestamp: new Date(),
					event: VoiceEvent.CONNECTED,
					channel: newChannel.name
				});
			}
			else if (oldChannel && !newChannel && this.voiceEventHandler) {
				this.voiceEventHandler.onVoiceEventReceived({
					username: oldMember.user.username,
					timestamp: new Date(),
					event: VoiceEvent.DISCONNECTED,
					channel: oldChannel.name
				});
			}
			else if (this.voiceEventHandler && oldChannel.name !== newChannel.name) {
				this.voiceEventHandler.onVoiceEventReceived({
					username: oldMember.user.username,
					timestamp: new Date(),
					event: VoiceEvent.DISCONNECTED,
					channel: oldChannel.name
				});
				this.voiceEventHandler.onVoiceEventReceived({
					username: newMember.user.username,
					timestamp: new Date(),
					event: VoiceEvent.CONNECTED,
					channel: newChannel.name
				});
			}
		});
	}
}