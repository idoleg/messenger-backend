import Chalk from "../Chalk";
import Debug from "../Logging";
import BaseRoom from "./Room/BaseRoom";
import Room from "./Room/Room";
import User from "./User/User";
import WebSocketConnection from "./WebSocketConnection";

export default class Client {

    public readonly name: string;
    public readonly connection: WebSocketConnection;
    public readonly rooms: { [index: string]: BaseRoom } = {};
    public readonly user: User;

    constructor(name: string, connection: WebSocketConnection, user: User) {
        this.name = name;
        this.connection = connection;
        this.user = user;

        this.user.add(this);

        this.emit("greeting", {name: this.getName()});
        Debug.info("New client is connected. His name is " + Chalk.cyan(this.getName()));

        this.connection.on("close", (client, reasonCode, description) => {
            for (const roomName in this.rooms) {
                if (this.rooms.hasOwnProperty(roomName)) {
                    const room = this.rooms[roomName];

                    room.remove(this);
                }
            }

            Debug.info(
                "Client is disconnected. His name was "
                + Chalk.cyan(this.getName())
                + `. Reason: ${reasonCode}, ${description}`,
            );
        });
    }

    public linkWithRoom(room: Room) {
        this.rooms[room.name] = room;
    }

    public unlinkWithRoom(room: Room) {
        delete this.rooms[room.name];
    }

    public getName() {
        return this.name;
    }

    public emit(name: string, payload: any) {
        this.connection.send(name, payload);
    }

    public on(name: string, callback: (...args: any[]) => void) {
        this.connection.on(name, callback);
    }
}
