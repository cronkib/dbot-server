export interface MessageActivity {
	id?: number;
	content: string;
	channel: string;
	username: string;
	timestamp: Date;
}

export interface VoiceActivity {
	id?: number;
	username: string;
	event: string;
	channel: string;
	timestamp: Date;
}

export interface ChannelCount {
	channel: string;
	count: number;
	lastMessage: Date;
}

export interface MessageHandler {
	onMessageReceived(message: MessageActivity): void;
}

export interface VoiceEventHandler {
	onVoiceEventReceived(voiceEvent: VoiceActivity): void;
}

export class VoiceEvent {
	static CONNECTED = "connected";
	static DISCONNECTED = "disconnected";
}