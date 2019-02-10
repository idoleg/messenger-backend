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
            const event = new WebSocketEvent(Origin.CLIENT_SIDE_EVENT); //, data.response, data.result);
            event.parseRequest(message.utf8Data);

            const result = (status: boolean, payload: any) => {
                this.respond(event.id as number, payload, status);
            };

            this.emit(event.name, event.payload, this.client, result, event);
            this.wsServer.emit(event.name, event.payload, this.client, result, event);
        } catch (err) {
            Debug.error(err);
}
    }

    public send(name: string, payload: any) {
        const event = new WebSocketEvent(Origin.SERVER_SIDE_EVENT, this.nextEventId, name, payload);

        this.wsConnection.sendUTF(JSON.stringify(event));
        this.nextEventId = this.nextEventId + 2;
    }

    public respond(to: number, payload: any, result: boolean) {
         const responseEvent = new WebSocketEvent(Origin.SERVER_SIDE_EVENT, null, undefined, payload, to, result);
        // this.wsConnection.sendUTF(JSON.stringify(responseEvent));
        this.wsConnection.sendUTF(responseEvent.toString());
    }

    public error(code: number, description: string) {
        this.send("error", {
            code,
            description,
        });
    }

}
