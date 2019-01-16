import EventEmitter from "events";
import fs from "fs";
import mongoose, {ConnectionOptions, Document, Model, Mongoose} from "mongoose";
import {parse as parseFile} from "path";
import Application from "../Core/Application";
import Logging from "../Logging";

interface IConnectionOptions extends ConnectionOptions {
    uri?: string;
    address?: string;
    port?: string | number;
    database?: string;
}

export default class MongodbClient extends EventEmitter  {

    public mongoose: Mongoose;
    // public readonly models = new Map<string, Model<any>>();
    protected connectionOptions: IConnectionOptions;
    protected readonly $app: Application;

    constructor(app: Application, options?: IConnectionOptions) {
        super();
        this.$app = app;
        this.setOptions(options);

        this.mongoose = mongoose;
        this.$app.attach("mongodb", this);
    }

    public setOptions(options: IConnectionOptions = {address: "localhost", port: 27017}) {
        this.connectionOptions = options;
    }

    public async importModel(fileName: string) {
        const {"default": model} = await import(fileName);

        const initModel = model.call(this, this.mongoose);
        // this.models.set(initModel.modelName, initModel);
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

    public getModel<T extends Document, U extends Model<T>>(name: string): U {
        return this.mongoose.model<T, U>(name);
    }

    public async init() {
        this.emit("registeredAllModels");
        const options = {useCreateIndex: this.$app.isDebug(), useNewUrlParser: true, ...this.connectionOptions};
        const uri = options.uri ? options.uri : `mongodb://${options.address}:${options.port}/${options.database}`;

        await this.mongoose.connect(uri, filterOptions(options));
        Logging.notice(`Mongo client is successfully connected to ${uri}`);
    }

    public async destroyed() {
        await this.mongoose.disconnect();
    }
}

function filterOptions(config: any): object {
    const validConfig: any = {};
    const validParams = ["user", "pass", "autoIndex", "bufferCommands", "useCreateIndex", "useFindAndModify", "useNewUrlParser"];
    for (const param of validParams) {
        if (param in config) validConfig[param] = config[param];
    }

    return validConfig;
}
