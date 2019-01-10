import Chalk from "../Chalk";
import Logging from "../Logging";

export enum Status {
    NOT_INIT = "not_init",
    INITIALIZATION = "initialization",
    WORKING = "working",
    DESTROYING = "destroying",
    DESTROYED = "destroyed",
    ERROR = "error",
}

type Hooks = "beforeInit" | "init" | "afterInit" | "beforeDestroy" | "destroyed" | "errorDestroyed";

const aliases: { [index: string]: string } = {
    beforeStart: "beforeInit",
    start: "init",
    afterStart: "afterInit",
    beforeStop: "beforeDestroy",
    stop: "destroyed",
    error: "errorDestroyed",
};
const hooks: Hooks[] = ["beforeInit", "init", "afterInit", "beforeDestroy", "destroyed", "errorDestroyed"];

const nodeExitEvents = [
    {name: "exit"},
    {name: "SIGINT"},
    {name: "SIGUSR1"},
    {name: "SIGUSR2"},
];

const nodeUncaughtErrorEvents = [
    {name: "uncaughtException", readableName: "Unhandled Exception"},
    {name: "unhandledRejection", readableName: "Unhandled Rejection"},
];

/**
 *
 * Event names:
 *   beforeInit, beforeStart
 *   init, start
 *   afterInit, afterStart
 *   beforeDestroy, beforeStop
 *   destroy, stop
 *   errorDestroyed, error
 *
 * Methods in attached object:
 *   async beforeInit ()
 *   async init ()
 *   async afterInit
 *   async beforeDestroy ()
 *   async destroyed ()
 *   async errorDestroyed (Error error)
 *
 */
export default class Lifecycle {

    private status: Status = Status.NOT_INIT;
    private handlers: { [index: string]: Function[] } = {};

    constructor() {

        process.on("beforeExit", () => {
            Logging.notice("No more work. Exiting...");
            this.destroy();
        });

        nodeExitEvents.forEach((event) => {
            process.on(event.name as any, () => {
                if (this.status !== Status.WORKING) {
                    return;
                }
                Logging.warning("Forced exit");
                this.destroy();
            });
        });

        nodeUncaughtErrorEvents.forEach((event) => {
            process.on(event.name as any, (error: object) => {
                this.errorHandler(error, event.readableName);
            });
        });
    }

    public on(name: Hooks | string | object, callback?: Function) {
        if (typeof name === "object") {
            const object: any = name;

            for (const hook of hooks) {
                if (hook in object && typeof object[hook] === "function") {
                    this.on(hook, object[hook].bind(object));
                }
            }

            return;
        }
        if (!callback) {
            return;
        }

        if (aliases[name]) {
            name = aliases[name];
        }

        if (!this.handlers[name]) {
            this.handlers[name] = [];
        }

        this.handlers[name].push(callback);
    }

    public async init() {
        if (this.status !== Status.NOT_INIT) return;

        try {
            this.log("initialization");
            this.status = Status.INITIALIZATION;

            await this.emit("beforeInit");
            await this.emit("init");

            this.log("working");
            this.status = Status.WORKING;

            await this.emit("afterInit");
        } catch (error) {
            await this.errorHandler(error, "Exception while initialization");
        }
    }

    public async destroy() {
        if (this.status !== Status.WORKING) return;

        try {
            this.log("destroying");
            this.status = Status.DESTROYING;

            await this.emit("beforeDestroy");
            await this.emit("destroyed");

            this.log("destroyed");
            this.status = Status.DESTROYED;
        } catch (error) {
            await this.errorHandler(error, "Exception while destroying");
        }
    }

    public async errorHandler(error: object, type: string) {
        this.log("error-destroying");
        this.status = Status.ERROR;

        Logging.error(type + ":");
        Logging.renderError(error);

        await this.emit("errorDestroyed", error, type);

        this.log("error-destroyed");
    }

    public getStatus() {
        return this.status;
    }

    protected log(status: string) {
        Logging.write(Chalk.bgMagenta.whiteBright("Lifecycle: " + status));
    }

    protected async emit(name: Hooks, ...params: any[]) {
        if (!this.handlers[name]) {
            return;
        }

        const promises: Array<Promise<Function>> = [];

        this.handlers[name].map((callback) => {
            promises.push(callback(params));
        });

        return await Promise.all(promises);
    }

}
