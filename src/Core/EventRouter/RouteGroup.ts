import EventRouter from "./EventRouter";
import Route from "./Route";

export default class RouteGroup {

    protected eventRouter: EventRouter | null;
    protected readonly parentGroup: RouteGroup | null;

    protected prefix: string = "";
    protected routes: { [index: string]: Route[] } = {};
    protected pathsToControllers: { [index: string]: string } = {};

    constructor(eventRouter: EventRouter | null, parentGroup: RouteGroup | null) {
        this.eventRouter = eventRouter;
        this.parentGroup = parentGroup;

        if (this.eventRouter) this.eventRouter.groups.add(this);

        return new Proxy(this, this);
    }

    public controllerDir(handlerName: string, path: string): this {
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

    public group(callback?: Function | string): RouteGroup {
        const group = new RouteGroup(this.eventRouter, this);
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

    public get(target: any, handlerName: string) {
        if (handlerName in target) return target[handlerName];

        return (routeName: any, payload: any) => this.handle(handlerName, routeName, payload);
    }

    public handle(handlerName: string, routeName: any, payload: any) {
        this.addRouteForHandler(handlerName, new Route(this, handlerName, routeName, payload));
        return this.applyRoutesForHandler(handlerName);
    }

    public async resolveController(controllerName: string, handlerName: string) {
        if (this.eventRouter) {
            return await this.eventRouter.resolveController(this.pathsToControllers[handlerName] + "/" + controllerName);
        }
    }

    public resolveEventHandler(handlerName: string) {
        if (this.eventRouter) {
            return this.eventRouter.resolveEventHandler(handlerName);
        }
    }

    protected addRouteForHandler(handlerName: string, route: Route) {
        if (!this.routes[handlerName]) {
            this.routes[handlerName] = [];
        }

        this.routes[handlerName].push(route);
    }

    protected applyRoutesForHandler(handlerName: string) {
        if (!this.routes[handlerName]) return;
        const handler = this.resolveEventHandler(handlerName);
        if (!handler) return;

        for (const route of this.routes[handlerName]) {
            route.apply(handler);
        }

    }

}
