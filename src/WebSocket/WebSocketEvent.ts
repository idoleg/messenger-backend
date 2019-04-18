export enum Origin {
    SERVER_SIDE_EVENT,
    CLIENT_SIDE_EVENT,
}

export default class WebSocketEvent {

    public readonly origin: Origin;
    public id: number | null;
    public name: string;
    public payload: any;
    public readonly response: number | null;
    public readonly result: any | null;

    constructor(
        origin: Origin,
        id: number | null = null,
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

    public parseRequest(message: string) {
        const parsedMessage = message.split("[");
        this.id = +parsedMessage[0];
        const startPayload = parsedMessage[1].search("{");
        this.name = parsedMessage[1].substring(1, startPayload - 2);
        this.payload = JSON.parse(parsedMessage[1].substring(startPayload, parsedMessage[1].length - 1));
    }

    public toString() {
        return `${this.response ? -this.response : ""}["${this.name !== "nameless" ? this.name : this.result}",${JSON.stringify(this.payload)}]`;
    }
}
