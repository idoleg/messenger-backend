export enum Origin {
    SERVER_SIDE_EVENT,
    CLIENT_SIDE_EVENT,
}

export default class WebSocketEvent {

    public readonly origin: Origin;
    public readonly id: number | null;
    public readonly name: string;
    public readonly payload: any;
    public readonly response: number | null;
    public readonly result: any | null;

    constructor(
        origin: Origin,
        id: number | null,
        name: string = "nameless",
        payload: any = null,
        response: number | null = null,
        result: any | null = null,
    ) {
        this.origin = origin;
        this.id = id;
        this.name = name;
        this.response = response;
        this.result = result;
        this.payload = payload;

        Object.defineProperties(this, {
            origin: {enumerable: false},
            id: {enumerable: this.isMain()},
            name: {enumerable: this.isMain()},
            response: {enumerable: this.isResponse()},
            result: {enumerable: this.isResponse()},
        });

    }

    public isMain() {
        return !this.response;
    }

    public isResponse() {
        return !this.isMain();
    }

    public toString() {
        return `${this.response ? -this.response : ''}[${this.result},${JSON.stringify(this.payload)}]`;
    }
}
