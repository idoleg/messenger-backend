import Logging from "../../Logging";
import EventRouter from "./EventRouter";
import Route from "./Route";

const defaultHandler = Symbol("defaultHandler");

export default class RouteGroup {

    public readonly handlers = new Map<string | symbol, Function>();

    protected eventRouter: EventRouter | null;
    protected readonly parentGroup: RouteGroup | null;

    protected prefix: string = "";
    protected routes: { [index: string]: Route[] } = {};
    protected pathsToControllers: { [index: string]: string } = {};

    constructor(eventRouter: EventRouter | null, parentGroup: RouteGroup | null) {
        this.eventRouter = eventRouter;
        this.parentGroup = parentGroup;

        if (this.eventRouter) this.eventRouter.groups.add(this);

        return new Proxy(this, {
            get(target: any, handlerName: string) {
                if (handlerName in target) return target[handlerName];

                return (routeName: any, payload: any) => target.handle(handlerName, routeName, payload);
            },
        });
    }

    public controllerDir(handlerName: string, path?: string): this {
        if (!path) {
            (this.pathsToControllers as any)[defaultHandler] = handlerName;
            return this;
        }
        this.pathsToControllers[handlerName] = path;
        return this;
    }

    public setPrefix(prefix: string): this {
        this.prefix = prefix;
        return this;
    }

    public getPrefix(): string {
        if (this.parentGroup) {
            return this.parentGroup.getPrefix() + this.prefix;
        }

        return this.prefix;
    }

    public group(prefix?: string, callback?: Function): RouteGroup {
        const group = new RouteGroup(this.eventRouter, this);

        if (prefix) this.setPrefix(prefix);
        if (callback) group.execute(callback);

        return group;
    }

    public execute(callback: Function | string) {
        if (typeof callback === "string") {
            this.import(callback);
            return;
        }

        if (!callback) return;

        callback.call(this, this);
    }

    public async import(fileName: string) {
        const module = await import(fileName);
        return this.execute(module.default);
    }

    public handle(handlerName: string, routeName: any, payload: any) {
        if (!payload && !routeName) {
            const handler = this.resolveEventHandler(handlerName);
            if (handler) return handler();
            Logging.warning(`Only callback returned route has no handler`);
            return;
        }

        this.addRouteForHandler(handlerName, new Route(this, handlerName, routeName, payload));
        return this.applyRoutesForHandler(handlerName);
    }

    public registerHandler(handlerName: string | symbol, handler: Function | object): this {
        if (typeof handler === "object") {
            const object = handler as any;

            if ("route" in object) {
                this.registerHandler(
                    handlerName,
                    (...params: any[]) => object.route.apply(object, params),
                );
            }
            return this;
        }

        this.handlers.set(handlerName, handler);

        this.applyRoutesForHandler(handlerName);
        return this;
    }

    public registerDefaultHandler(handler: Function | object): this {
        return this.registerHandler(defaultHandler, handler);
    }

    public async resolveController(controllerName: string, handlerName: string) {
        let pathToController: string;
        if (this.pathsToControllers[handlerName]) {
            pathToController = this.pathsToControllers[handlerName];
        } else {
            pathToController = (this.pathsToControllers as any)[defaultHandler];
        }

        if (this.eventRouter) {
            return await this.eventRouter.resolveController(pathToController + "/" + controllerName);
        }
    }

    public resolveEventHandler(handlerName: string | symbol): any {
        let handler: Function | undefined;
        if (this.handlers.has(handlerName)) {
            handler = this.handlers.get(handlerName);
        } else if (this.parentGroup) {
            handler = this.parentGroup.resolveEventHandler(handlerName);
        }

        if (!handler && this.handlers.has(defaultHandler)) {
            return this.handlers.get(defaultHandler);
        }
    }

    protected addRouteForHandler(handlerName: string, route: Route) {
        if (!this.routes[handlerName]) {
            this.routes[handlerName] = [];
        }

        this.routes[handlerName].push(route);
    }

    protected applyRoutesForHandler(handlerName: string | symbol) {
        let routes: Route[];
        if (handlerName === defaultHandler) {
            routes = objectToFlatArray(this.routes);
        } else if (typeof handlerName === "symbol") {
            return;
        } else {
            if (!this.routes[handlerName]) return;
            routes = this.routes[handlerName];
        }

        const handler = this.resolveEventHandler(handlerName);
        if (!handler) return;

        for (const route of routes) {
            route.apply(handler);
        }

    }

}

function objectToFlatArray(object: any) {
    const result: any[] = [];

    // if (Object.keys().length === 0) {
    //     return result;
    // }

    Object.keys(object).forEach((key: string) => {
        result.concat(object[key]);
    });

    return result;

}
