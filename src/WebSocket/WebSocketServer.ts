import EventEmitter from "events";
import http, { Server } from "http";
import websocket, { request as WsRequest, server as WsServer } from "websocket";
import { DB } from "../../app/index";
import { IUser, IUserModel } from "../../app/Models/User.d";
import Chalk from "../Chalk";
import Application from "../Core/Application";
import Debug from "../Logging";
import Client from "./Client";
import RoomRepository from "./Room/RoomRepository";
import UserRepository from "./User/UserRepository";
import WebSocketConnection from "./WebSocketConnection";

export default class WebSocketServer extends EventEmitter {

    public readonly $app: Application;

    public readonly rooms = new RoomRepository();
    public readonly users = new UserRepository(this.rooms);
    public readonly clients = this.rooms.create("server");

    public httpServer: Server;
    protected wsServer: WsServer;

    constructor(app: Application, server?: Server) {
        super();
        this.$app = app;
        this.$app.attach("socket", this);

        if (server) this.httpServer = server;
    }

    public async afterInit() {
        Debug.info("Starting WebSocket server...");

        if (this.$app.get("server")) {
            this.httpServer = this.$app.get("server").httpServer;
        }
        if (this.httpServer == null) {
            this.httpServer = await createHttpServer(this.$app.config.get("socket"));
        }

        this.wsServer = new WsServer({ httpServer: this.httpServer, ...this.$app.config.get("socket") });
        this.wsServer.on("request", (request: any) => this.inspectEachConnection(request));

        Debug.notice(
            "WebSocket server is started on address "
            + Chalk.underline(this.getAddress()),
        );

    }

    public async destroyed() {
        this.wsServer.shutDown();
        this.httpServer.close();
    }

    public getAddress() {
        if (this.httpServer) {
            const address = this.httpServer.address();
            if (typeof address !== "string") {
                return `ws://${address.address}:${address.port}`;
            }
        }
        return "";
    }

    public async inspectEachConnection(request: WsRequest) {
        try {
            if (request.resourceURL.pathname === "/socket") {
                const query = request.resourceURL.query as any;
                const User = DB.getModel<IUser, IUserModel>("User");
                const foundUser = await User.findByToken(query.token);
                if (typeof foundUser !== "boolean") {
                    const user = this.user(foundUser.id);
                    user.model = foundUser;

                    const connection = new WebSocketConnection(request.accept(undefined, request.origin), this);
                    const client = new Client(this.generateUniqueClientName(), connection, user);
                    connection.client = client;
                    this.clients.add(client);

                    this.emit("connect", client);
                } else {
                    request.reject(403, "no valid token");
                }
            } else {
                request.reject(404, "wrong path");
            }
        } catch {
            request.reject(403, "no valid token");
        }
    }

    public generateUniqueClientName() {
        let name = this.$app.getUniqueString("client").slice(0, -27);
        if (this.clients.has(name)) name = this.generateUniqueClientName();

        return name;
    }

    public client(name: string) {
        return this.clients.get(name);
    }

    public room(name: string) {
        return this.rooms.getOrCreate(name);
    }

    public user(name: string) {
        return this.users.getOrCreate(name);
    }

}

function createHttpServer(socket: any): Promise<Server> {

    return new Promise((resolve, reject) => {
        const server = http.createServer()
            .on("error", (err) => {
                Debug.error(`Не удалось создать сервер (порт ${socket.port} занят или произошла другая ошибка)`);
                reject(err);
            })
            .listen(socket.port, socket.host, () => {
                Debug.info(`HTTP server is started on address //${socket.host}:${socket.port}`);
                resolve(server);
            });
    });

}
