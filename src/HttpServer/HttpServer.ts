import bodyParser from "body-parser";
import cors, {CorsOptions} from "cors";
import express, {Express, Router} from "express";
import fs from "fs";
import {Server} from "http";
import httpError from "http-errors";
import {parse as parseFile} from "path";
import Application from "../Core/Application";
import Logging from "../Logging";
import BaseResource from "./BaseResource";

interface IServerOptions {
    port: number;
    host: string;
    cors?: CorsOptions;
    basepath?: string;
    bodyParser?: bodyParser.OptionsJson & bodyParser.OptionsText & bodyParser.OptionsUrlencoded;
}

export default class HttpServer {

    public readonly expressRouter: Router;
    public readonly expressApp: Express;
    public httpServer: Server;
    protected options: IServerOptions;
    protected readonly $app: Application;

    constructor(app: Application, options?: IServerOptions) {
        this.$app = app;

        this.setOptions(options);
        this.expressApp = express();
        this.expressRouter = express.Router();

        this.$app.attach("server", this);
    }

    public setOptions(options: IServerOptions = {port: 80, host: "localhost"}) {
        this.options = options;
    }

    public async importRoute(fileName: string) {
        const {"default": routes} = await import(fileName);

        if (routes.call) {
            return routes.call(this.expressRouter, this.expressApp, this.$app);
        }
    }

    public async importRoutes(path: string) {
        const files = await fs.promises.readdir(path);

        for (const file of files) {
            const fileName = path + "/" + file;
            if (parseFile(fileName).ext !== ".js") continue;

            await this.importRoute(fileName);
        }
    }

    public async init() {
        const basepath = this.options.basepath || "/";
        this.expressApp.disable("x-powered-by");

        this.expressApp.use(basepath, express.json());
        this.expressApp.use(cors(this.options.cors));
        this.expressApp.use(basepath, cors());
        this.expressApp.use(basepath, bodyParser.json(this.options.bodyParser));
        this.expressApp.use(basepath, bodyParser.urlencoded(this.options.bodyParser));
        this.expressApp.use(basepath, this.expressRouter);
        this.expressRouter.use(basepath, () => {
            throw new httpError.NotFound("Wrong path");
        });
        this.expressApp.use(basepath, this.resourceHandler.bind(this));
        this.expressApp.use(basepath, this.errorHandler.bind(this));

        this.httpServer = await createListener(this.expressApp, this.options);
    }

    public async destroyed() {
        this.httpServer.close(() => Logging.info("HTTP server is stopped"));
    }

    protected resourceHandler(resource: any, req: any, res: any, next: any) {
        if (resource instanceof BaseResource) {
            resource.attach(req, res);
            res.json(resource.uncover());
        } else {
            next(resource);
        }
    }

    protected errorHandler(err: any, req: any, res: any, next: any) {
        res.status(err.status || 500);
        if (typeof err.message === "string") {
            res.json({message: err.message});
        } else {
            res.json(err.message);
        }
        if (!err.status) next(err);
    }
}

async function createListener(expressApp: Express, options: IServerOptions): Promise<Server> {

    return new Promise<Server>((resolve, reject) => {
        const server = expressApp.listen(options.port, options.host, () => {
            Logging.notice(`HTTP server is started on address //${options.host}:${options.port}`);
            resolve(server);
        });
    });

}
