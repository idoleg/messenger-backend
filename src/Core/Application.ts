import crypto from "crypto";
import EventEmitter from "events";
import ApplicationConfig from "./ApplicationConfig";
import ApplicationContext from "./ApplicationContext";
import EventRouter from "./EventRouter/EventRouter";
import Lifecycle from "./Lifecycle";
import dotenv from "dotenv";
import {dirname} from "path";
import fs from "fs";

export default class Application extends EventEmitter {

    public readonly startTime: number;
    public readonly config: ApplicationConfig;
    public readonly lifecycle: Lifecycle;
    public readonly router: EventRouter;
    public readonly context: ApplicationContext;

    constructor(config: object | boolean = true) {
        super();

        this.startTime = (new Date()).valueOf();

        this.config = new ApplicationConfig();
        this.lifecycle = new Lifecycle();
        this.router = new EventRouter(this);
        this.context = new ApplicationContext();

        if (typeof config === "object") {
            this.config.set("app", config);
        }

        if (config === true) {
            const environmentType = process.env.APP_ENV || "";
            const startDir = dirname(dirname(dirname(module.filename)));

            try {
                const envFile = this.getPathToEnvFile(environmentType, 3, startDir);
                dotenv.config({path: envFile});
            } catch (e) {
                /**/
            }

        }

        // return new Proxy(this, this)
    }

    public attach(name: string, object: object) {
        this.lifecycle.on(object);
        this.router.registerHandler(name, object);
        this.context.set(name, object);
    }

    public get(name: string): any {
        return this.context.get(name);
    }

    public async start() {
        await this.lifecycle.init();
    }

    public async stop() {
        await this.lifecycle.destroy();
    }

    public isDebug(): boolean {
        return this.config.get("app.debug", false);
    }

    public getUniqueString(salt: (string | null) = null): string {
        const date = new Date();
        const value = "" + (date.valueOf() - this.startTime) + date.getMilliseconds() + Math.random() + salt;

        return (crypto.createHash("sha256") as any).update(value, "binary").digest("base64").slice(0, -1);
    }

    protected getPathToEnvFile(environmentType: string, deep: number, dir: string): string {
        const type = environmentType.length > 0 ? "." + environmentType : environmentType;

        if (fs.existsSync(dir + `/.env${type}`)) {
            return dir + `/.env${type}`;
        } else {
            if (deep <= 0) {
                throw new Error("Env file has not found");
            }
            return this.getPathToEnvFile(environmentType, --deep, dirname(dir));
        }
    }
}
