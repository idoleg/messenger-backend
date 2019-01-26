import chai from "chai";
import chaiHttp from "chai-http";
import dotenv from "dotenv";
import MongoMemoryServer from "mongodb-memory-server";
import {dirname} from "path";
import {SuperAgent} from "superagent";
import HttpServer from "../../src/HttpServer/HttpServer";

const TEST_ENV_FILE = dirname(dirname(dirname(module.filename))) + "/.env.test";

process.env.APP_ENV = "test";
process.env.AUTO_FAKER_OFF = "true";

import {App} from "../../dist/app/index";

export let Agent: () => SuperAgent<any>;
export let Server: HttpServer;
export const TestApp = App;
export const Config = App.config;
export const DB = App.get("mongodb");
export const MongoServer = new MongoMemoryServer();

chai.use(chaiHttp);
chai.should();

before((done) => {
    App.lifecycle.on("beforeInit", async () => {
        const port = await MongoServer.getPort();
        const database = await MongoServer.getDbName();
        DB.setOptions({address: "localhost", port, database});
    });
    App.lifecycle.on("afterInit", () => {
        Agent = () => chai.request(App.get("server").httpServer);
        Server = App.get("server").httpServer;
        done();
    });
});

after(async () => {
    await App.stop();
    await MongoServer.stop();
});
