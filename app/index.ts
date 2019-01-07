import dotenv from "dotenv";
import {dirname} from "path";
import Console from "../src/Console/Console";
import Application from "../src/Core/Application";
// import WebSocketServer from '../src/WebSocket/WebSocketServer';

dotenv.config();
const BASE_PATH = dirname(dirname(module.filename));
const CONFIG_PATH = dirname(BASE_PATH) + "/" + "/config/";
const ROUTES_PATH = dir("routes");

export const App = new Application();
export const Config = App.config;

// export const Socket = new WebSocketServer(App);

App.router.group()
    .controllerDir("socket", dir("app", "WebSocketController"))
    .import(ROUTES_PATH + "/ws");

(async () => {
    await Config.loadFromFile(CONFIG_PATH);

    /* tslint:disable-next-line */
    if (App.isDebug()) new Console(App);

    await App.start();
})();

function dir(...name: string[]): string {
    return [BASE_PATH, ...name].join("/");
}
