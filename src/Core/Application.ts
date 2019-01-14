import crypto from "crypto";
import EventEmitter from "events";
import ApplicationConfig from "./ApplicationConfig";
import ApplicationContext from "./ApplicationContext";
import EventRouter from "./EventRouter/EventRouter";
import Lifecycle from "./Lifecycle";
import Match = Chai.Match;

export default class Application extends EventEmitter {

    public readonly startTime: number;
    public readonly config: ApplicationConfig;
    public readonly lifecycle: Lifecycle;
    public readonly router: EventRouter;
    public readonly context: ApplicationContext;

    constructor(config: object = {}) {
        super();

        this.startTime = (new Date()).valueOf();

        this.config = new ApplicationConfig();
        this.lifecycle = new Lifecycle();
        this.router = new EventRouter(this);
        this.context = new ApplicationContext();

        if (typeof config === "object") {
            this.config.set("app", config);
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
}
