import cors, {CorsOptions} from "cors";
import bodyParser from "body-parser";
import express, {Express, Router} from "express";
import {Server} from "http";
import Application from "../Core/Application";
import Logging from "../Logging";

interface IServerOptions {
    port: number;
    host: string;
    cors?: CorsOptions;
    bodyParser?: bodyParser.OptionsJson & bodyParser.OptionsText & bodyParser.OptionsUrlencoded;
}

export default class HttpServer {

    protected expressRouter: Router;
    protected expressApp: Express;
    protected httpServer: Server;
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

    public async importRoutes(fileName: string) {
        const {"default": routes} =  await import(fileName);
        return routes.call(this.expressRouter, this.expressApp);
    }

    public async init() {
        this.expressApp.use(express.json());
        this.expressApp.use(cors(this.options.cors));
        this.expressApp.use(bodyParser.json(this.options.bodyParser));
        this.expressApp.use(bodyParser.urlencoded(this.options.bodyParser));
        this.expressApp.use(this.expressRouter);

        this.httpServer = await createListener(this.expressApp, this.options);
    }

    public async destroyed() {
        this.httpServer.close(() => Logging.info("HTTP server is stopped"));
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
