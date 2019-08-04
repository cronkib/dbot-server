import { Response } from "express"

export class ResponseModel {
	constructor(private data: any, private message?: string) {
		this.data = data;
		this.message = message;
	}
}

export class ResponseSender {
	constructor(private response: Response) {
		this.response = response;
	}

	send(data: any) {
		this.response.json(new ResponseModel(data));
	}

	failAuthentication() {
		this.response.status(401).json(new ResponseModel(undefined, "Unauthorized access"));
	}

	failBadRequest() {
		this.response.status(400).json(new ResponseModel(undefined, "Bad request"));
	}

	failParam() {
		this.response.status(400).json(new ResponseModel(undefined, "Missing parameter"));
	}

	failUnknownRoute() {
		this.response.status(404).json(new ResponseModel(undefined, "Unknown route"));
	}

	failInternalError() {
		this.response.status(500).json(new ResponseModel(undefined, "An internal error occurred."));
	}
}