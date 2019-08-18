import { Response } from "express";
import ResponseModel from "./ResponseModel";

export class ResponseSender {
	constructor(private response: Response) {
		this.response = response;
	}

	public send(data: any) {
		this.response.json(new ResponseModel(data));
	}

	public failAuthentication() {
		this.response.status(401).json(new ResponseModel(undefined, "Unauthorized access"));
	}

	public failBadRequest() {
		this.response.status(400).json(new ResponseModel(undefined, "Bad request"));
	}

	public failParam() {
		this.response.status(400).json(new ResponseModel(undefined, "Missing parameter"));
	}

	public failUnknownRoute() {
		this.response.status(404).json(new ResponseModel(undefined, "Unknown route"));
	}

	public failInternalError() {
		this.response.status(500).json(new ResponseModel(undefined, "An internal error occurred."));
	}
}