import Application from "../Application";
import RouteGroup from "./RouteGroup";

export default class EventRouter extends RouteGroup {

    public readonly $app: Application;
    public readonly handlers = new Map<string, Function>();
    public readonly groups = new Set();
    public readonly controllerInstances = new Map<string, object>();

    constructor(app: Application) {
        super(null, null);
        this.eventRouter = this;
        this.$app = app;

        this.groups.add(this);
    }

    public registerHandler(handlerName: string, handler: Function | object) {
        if (typeof handler === "object") {
            const object = handler as any;

            if ("route" in object) {
                this.registerHandler(
                    handlerName,
                    (...params: any[]) => object.route.apply(object, params),
                );
            }
            return;
        }

        this.handlers.set(handlerName, handler);

        this.applyAllRoutesForHandler(handlerName);
    }

    public async resolveController(fileName: string) {
        if (this.controllerInstances.has(fileName)) {
            return this.controllerInstances.get(fileName);
        }

        const module = await import(fileName );
        const instance = new module.default(this, this.$app);

        this.controllerInstances.set(fileName, instance);
        return instance;
    }

    public resolveEventHandler(handlerName: string) {
        return this.handlers.get(handlerName);
    }

    private applyAllRoutesForHandler(handlerName: string) {
        this.groups.forEach((group) => group.applyRoutesForHandler(handlerName));
    }

    // logRoutes() {
    //     let list = [];
    //
    //     for (let handlerName in this.events) {
    //         let routes = this.events[handlerName];
    //
    //         for (let route of routes) {
    //             list.push({
    //                 Handler: handlerName,
    //                 Event: route.getName(),
    //                 Payload: route.payload,
    //             })
    //         }
    //     }
    //
    //     console.table(list, ['Handler', 'Event', 'Payload']);
    // }
}
