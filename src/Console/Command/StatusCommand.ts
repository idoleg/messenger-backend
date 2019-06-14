import Application from "../../Core/Application";
import Console from "../Console";
import BaseCommand from "./BaseCommand";

export default class StatusCommand extends BaseCommand {

    constructor() {
        super("status", "Get application status");
    }

    /* tslint:disable-next-line:no-shadowed-variable */
    public execute(Console: Console, args: string[], App: Application) {
        Console.info(App.lifecycle.getStatus());
    }

}
