import dotenv from "dotenv";
import {dirname} from "path";
import Console from "../src/Console/Console";
import Application from "../src/Core/Application";
import HttpServer from "../src/HttpServer/HttpServer";
// import WebSocketServer from '../src/WebSocket/WebSocketServer';
import MongodbClient from "../src/MongodbClient/MongodbClient";

dotenv.config();
const BASE_DIR = dirname(dirname(module.filename));
const CONFIG_DIR = dirname(BASE_DIR) + "/config";
const ROUTES_DIR = dir("app", "Routes");
const MODELS_DIR = dir("app", "Models");
// const CONTROLLERS_DIR = dir("app", "Controllers");

export const App = new Application();
export const Config = App.config;
export const DB = new MongodbClient(App);
export const Server = new HttpServer(App);
// export const Socket = new WebSocketServer(App);

// App.router.group()
//     .controllerDir("socket", dir("app", "WebSocketController"))
//     .import(ROUTES_DIR + "/ws");

(async () => {
    await Config.loadFromFile(CONFIG_DIR);

    /* tslint:disable-next-line */
    if (App.isDebug()) new Console(App);

    DB.setOptions(Config.get("db.mongo"));
    await DB.importModels(MODELS_DIR);

    Server.setOptions(Config.get("server"));
    await Server.importRoutes(ROUTES_DIR + "/api");

    await App.start();
})();

function dir(...name: string[]): string {
    return [BASE_DIR, ...name].join("/");
}
