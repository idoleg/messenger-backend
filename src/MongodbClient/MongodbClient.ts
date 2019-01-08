import fs from "fs";
import mongoose, {Mongoose} from "mongoose";
import {parse as parseFile} from "path";
import Application from "../Core/Application";
import Logging from "../Logging";

/* tslint:disable:interface-over-type-literal */
type ConnectionConfiguration = {
    address: string,
    port: string | number,
    database?: string,
    user?: string,
    pass?: string,
    autoIndex?: boolean,
    bufferCommands?: boolean,
    useCreateIndex?: boolean,
    useFindAndModify?: boolean,
    useNewUrlParser?: boolean,
};

export default class MongodbClient {

    public readonly models = new Map<string, object>();
    protected connectionConfig: ConnectionConfiguration;
    protected connection: Mongoose;
    protected readonly $app: Application;

    constructor(app: Application, config?: ConnectionConfiguration) {
        this.$app = app;
        this.setConfig(config);

        this.$app.attach("mongo", this);
    }

    public setConfig(config: ConnectionConfiguration = {address: "localhost", port: 27017}) {
        this.connectionConfig = config;
    }

    public getConnection() {
        return this.connection;
    }

    public async importModel(fileName: string) {
        const {"default": model} = await import(fileName);

        const initModel = model(mongoose);
        this.models.set(initModel.modelName, initModel);
        return initModel;
    }

    public async importModels(path: string) {

        const files = await fs.promises.readdir(path);

        for (const file of files) {
            const fileName = path + "/" + file;
            if (parseFile(fileName).ext !== ".js") continue;

            await this.importModel(fileName);
        }

    }

    public async init() {
        const config = {useCreateIndex: this.$app.isDebug(), useNewUrlParser: true, ...this.connectionConfig};

        this.connection = await mongoose.connect(`mongodb://${config.address}:${config.port}/${config.database}`, filterConfig(config));
        Logging.notice(`Mongo client is successfully connected to mongodb://${config.address}:${config.port}/${config.database}`);
    }

    public async destroyed() {
        await this.connection.disconnect();
    }
}

function filterConfig(config: any): object {
    const validConfig: any = {};
    const validParams = ["user", "pass", "autoIndex", "bufferCommands", "useCreateIndex", "useFindAndModify", "useNewUrlParser"];
    for (const param of validParams) {
        if (param in config) validConfig[param] = config[param];
    }

    return validConfig;
}
