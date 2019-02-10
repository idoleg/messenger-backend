import EventEmitter from "events";
import {connection as WsConnection} from "websocket";
import Debug from "../Logging";
import Client from "./Client";
import WebSocketEvent, {Origin} from "./WebSocketEvent";
import WebSocketServer from "./WebSocketServer";

export default class WebSocketConnection extends EventEmitter {

    public client: Client;
    public readonly wsConnection: WsConnection;
    public readonly wsServer: WebSocketServer;
    protected nextEventId = 1;

    constructor(wsConnection: WsConnection, wsServer: WebSocketServer) {
        super();
        this.wsConnection = wsConnection;
        this.wsServer = wsServer;
        this.nextEventId = 1;

        this.wsConnection.on("message", (message: any) => this.handleMessage(message));

        this.wsConnection.on("close", (reasonCode: number, description: string) => {
            this.emit("close", this.client, reasonCode, description, this);
            this.wsServer.emit("close", this.client, reasonCode, description, this);
        });
    }

    public handleMessage(message: any) {
        try {
            // console.log(message);
            const parsedMessage = message.utf8Data.split('[');
            const id = parsedMessage[0];
            const startPayload = parsedMessage[1].search("{");
            const name = parsedMessage[1].substring(1,startPayload-2);
            const payload = JSON.parse(parsedMessage[1].substring(startPayload,parsedMessage[1].length-1));
            const event = new WebSocketEvent(Origin.CLIENT_SIDE_EVENT, id, name, payload); //, data.response, data.result);

            // const data = JSON.parse(message.utf8Data);
            // const event = new WebSocketEvent(Origin.CLIENT_SIDE_EVENT, data.id, data.name, data.payload, data.response, data.result);

            const result = (status: boolean, payload: any) => {
                this.respond(event.id as number, payload, status);
            };

            this.emit(event.name, payload, this.client, result, event);
            this.wsServer.emit(event.name, payload, this.client, result, event);
            // this.emit(event.name, data.payload, this.client, result, event);
            // this.wsServer.emit(event.name, data.payload, this.client, result, event);
        } catch (e) {
            Debug.error(e);
}
    }

    public send(name: string, payload: any) {
        const event = new WebSocketEvent(Origin.SERVER_SIDE_EVENT, this.nextEventId, name, payload);

        this.wsConnection.sendUTF(JSON.stringify(event));
        this.nextEventId = this.nextEventId + 2;
    }

    public respond(to: number, payload: any, result: boolean) {
        // const responseEvent = new WebSocketEvent(Origin.SERVER_SIDE_EVENT, null, undefined, payload, to, result);
        // console.log(responseEvent);
        // this.wsConnection.sendUTF(JSON.stringify(responseEvent));
        this.wsConnection.sendUTF(`${-to}[${result},${JSON.stringify(payload)}]`);
    }

    public error(code: number, description: string) {
        this.send("error", {
            code,
            description,
        });
    }

}
