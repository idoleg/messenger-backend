import express, {Express, Router} from "express";
import {Server} from "http";
import {promisify} from "util";
import Application from "../Core/Application";
import RouteGroup from "../Core/EventRouter/RouteGroup";
import Logging from "../Logging";

interface IServerOptions {
    port: number;
    host: string;
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
