import express, { Router, RequestHandler } from "express";
import { NextHandleFunction } from "connect";
import { ExpressApp } from "../ExpressApp";
import bodyParser = require("body-parser");

export default class ExpressController {
	router: Router;
	routeHandlers: NextHandleFunction[];
	prefix: string;

	constructor() {
		this.router = express.Router();
		this.routeHandlers = [bodyParser.json()];
	}

	route(prefix: string) {
		this.prefix = prefix;
		return this;
	}

	get(url: string, handler: RequestHandler) {
		this.router.get(url, handler);
		return this;
	};

	put(url: string, handler: RequestHandler) {
		this.router.put(url, this.routeHandlers, handler);
		return this;
	};

	delete(url: string, handler: RequestHandler) {
		this.router.delete(url, this.routeHandlers, handler);
		return this;
	};

	post(url: string, handler: RequestHandler) {
		this.router.post(url, this.routeHandlers, handler);
		return this;
	};

	routeAll(handler: RequestHandler) {
		this.router.all("*", handler);
		return this;
	}

	done() {
		ExpressApp.use(this.prefix, this.router);
	}
}