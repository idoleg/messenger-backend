import Application from "../../Core/Application";
import Console from "../Console";
import BaseCommand from "./BaseCommand";

export default class ExitCommand extends BaseCommand {

    constructor() {
        super("exit", "Close Comet server");
    }

    /* tslint:disable-next-line:no-shadowed-variable */
    public execute(Console: Console, args: string[], App: Application) {
        App.stop();
    }

}
