import bodyParser = require("body-parser");
import { NextHandleFunction } from "connect";
import express, { RequestHandler, Router } from "express";
import { ExpressApp } from "../ExpressApp";

export default class ExpressController {
	public router: Router;
	public routeHandlers: NextHandleFunction[];
	public prefix: string;

	constructor() {
		this.router = express.Router();
		this.routeHandlers = [bodyParser.json()];
	}

	public route(prefix: string) {
		this.prefix = prefix;
		return this;
	}

	public get(url: string, handler: RequestHandler) {
		this.router.get(url, handler);
		return this;
	}

	public put(url: string, handler: RequestHandler) {
		this.router.put(url, this.routeHandlers, handler);
		return this;
	}

	public delete(url: string, handler: RequestHandler) {
		this.router.delete(url, this.routeHandlers, handler);
		return this;
	}

	public post(url: string, handler: RequestHandler) {
		this.router.post(url, this.routeHandlers, handler);
		return this;
	}

	public routeAll(handler: RequestHandler) {
		this.router.all("*", handler);
		return this;
	}

	public done() {
		ExpressApp.use(this.prefix, this.router);
	}
}
