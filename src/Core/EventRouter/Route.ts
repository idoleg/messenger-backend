import Logging from "../../Logging";
import RouteGroup from "./RouteGroup";

export enum TypeOfPayload {
    CALLBACK,
    CONTROLLER,
    NOT_DETERMINED,
}

export default class Route {

    public readonly type: TypeOfPayload = TypeOfPayload.NOT_DETERMINED;
    private applied: boolean;

    private router: RouteGroup;
    private readonly handlerName: string;
    private readonly routeName: any;
    private readonly payload: any;

    constructor(router: RouteGroup, handlerName: string, routeName: any, payload?: any) {
        if (!payload) {
            payload = routeName;
            routeName = "unnamedRoute";
        }

        this.router = router;

        this.handlerName = handlerName;
        this.routeName = routeName;
        this.payload = payload;
        this.applied = false;

        if (typeof this.payload === "function") {
            this.type = TypeOfPayload.CALLBACK;
        } else if (typeof this.payload === "string") {
            this.type = TypeOfPayload.CONTROLLER;
            this.payload = this.payload.split("@");
        }
    }

    public getName(): string {
        return this.router.getPrefix() + this.routeName;
    }

    public async apply(callback: Function) {
        if (this.applied) return;

        if (this.type === TypeOfPayload.CALLBACK) {
            callback(this.getName(), this.payload);
        } else if (this.type === TypeOfPayload.CONTROLLER) {
            const instance = await this.router.resolveController(this.payload[0], this.handlerName);

            if (instance[this.payload[1]]) {
                callback(this.getName(), instance[this.payload[1]].bind(instance));
            } else {
                Logging.warning(
                    `Controller ${this.payload[0]} does not have method ${this.payload[1]}. `
                    + `Route ${this.getName()} will not be applied and executed.`);
            }
        } else {
            Logging.warning(`Route ${this.getName()} will not be applied and executed because type of payload not defined.`);
        }

        this.applied = true;
    }

}
