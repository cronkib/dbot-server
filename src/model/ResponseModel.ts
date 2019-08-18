export default class ResponseModel {
	constructor(private data: any, private message?: string) {
		this.data = data;
		this.message = message;
	}
}