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
            if (this.status !== Status.WORKING) { return; }

            Logging.notice("No more work. Exiting...");
            this.destroy();
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
        if (!callback) { return; }

        if (aliases[name]) {
            name = aliases[name];
        }

        if (!this.handlers[name]) {
            this.handlers[name] = [];
        }

        this.handlers[name].push(callback);
    }

    public async init() {
        // try {
        this.log("initialization");
        this.status = Status.INITIALIZATION;

        await this.emit("beforeInit");
        await this.emit("init");

        this.log("working");
        this.status = Status.WORKING;

        await this.emit("afterInit");
        // } catch (error) {
        // this.errorHandler(error);
        // }
    }

    public async destroy() {
        // try {
        this.log("destroying");
        this.status = Status.DESTROYING;

        await this.emit("beforeDestroy");
        await this.emit("destroyed");

        this.log("destroyed");
        this.status = Status.DESTROYED;
        // } catch (error) {
        // this.errorHandler(error);
        // }
    }

    public getStatus() {
        return this.status;
    }

    protected log(status: string) {
        Logging.write(Chalk.bgMagenta.whiteBright("Lifecycle: " + status));
    }

    protected async emit(name: Hooks) {
        if (!this.handlers[name]) {
            return;
        }

        const promises: Array<Promise<Function>> = [];

        this.handlers[name].map((callback) => {
            promises.push(callback());
        });

        return await Promise.all(promises);
    }

}
