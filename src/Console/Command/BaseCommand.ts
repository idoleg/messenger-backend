import Application from "../../Core/Application";
import Console from "../Console";

export default class BaseCommand {

    protected name: string;
    protected description: string;
    protected additionalCommands: object[];

    constructor(name: string, description: string, additionalCommands: object[] = []) {
        this.name = name;
        this.description = description;
        this.additionalCommands = additionalCommands;
    }

    public mapOfCommands(callback: Function) {
        callback(
            this.name,
            (...params: any[]) => this.execute.apply(this, params),
            this.description,
        );

        this.additionalCommands.map((commandDefinition: { command: string, method: string, description: string }) => {
            callback(
                this.name + ":" + commandDefinition.command,
                (...params: any[]) => (this as any)[commandDefinition.method].apply(this, params),
                commandDefinition.description,
            );
        });
    }

    /* tslint:disable-next-line */
    public execute(Console: Console, args: string[], App: Application) { }
}
