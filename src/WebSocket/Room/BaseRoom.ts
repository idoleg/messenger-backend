import { IUser } from "../../../app/Models/User.d";
import Client from "../Client";

export default class BaseRoom {

    public name: string;
    public model: IUser;
    protected clients: { [index: string]: Client } = {};
    protected length = 0;

    constructor(name: string) {
        this.name = name;
    }

    public getName() {
        return this.name;
    }

    public add(client: Client) {
        this.clients[client.getName()] = client;
        this.length++;
        client.linkWithRoom(this);

        return client;
    }

    public get(name: string) {
        return this.clients[name];
    }

    public has(name: string) {
        return this.clients[name] != null;
    }

    public map(callback: Function) {
        for (const clientName in this.clients) {
            if (this.clients.hasOwnProperty(clientName)) {
                const client = this.clients[clientName];

                callback(client);
            }
        }
    }

    public emit(name: string, payload: any) {
        this.map((client: Client) => {
            client.emit(name, payload);
        });

    }

    public on(name: string, callback: (...args: any[]) => void) {
        this.map((client: Client) => {
            client.on(name, callback);
        });
    }

    public remove(name: string | Client) {

        if (name instanceof Client) {
            this.remove(name.getName());
            return;
        }

        if (name in this.clients) {
            this.clients[name].unlinkWithRoom(this);
            delete this.clients[name];
            this.length--;
        }
    }

    public clear() {
        this.map((client: string) => {
            this.remove(client);
        });
        this.clients = {};
        this.length = 0;
    }

    // statistics(){
    //     const data = {};
    //     data['count'] = this._length;
    //     data['clientsNames'] = Object.keys(this._clients);
    //
    //     return data;
    // }

}
