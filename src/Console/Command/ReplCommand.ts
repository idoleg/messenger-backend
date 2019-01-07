import repl from "repl";
import Chalk from "../../Chalk";
import Application from "../../Core/Application";
import Debug from "../../Logging";
import Console from "../Console";
import BaseCommand from "./BaseCommand";

export default class ReplCommand extends BaseCommand {

    constructor() {
        super("repl", "Read-Eval-Print-Loop for testing");
    }

    /* tslint:disable-next-line:no-shadowed-variable */
    public async execute(Console: Console, args: string[], App: Application) {
        await new Promise ((resolve, reject) => {
            Console.notice("It's interactive computer programming environment for debugging.");
            Console.notice("Here availables most of JS functions. To access CometServer write 'App'. For Exit write '.exit'.");
            Console.stop();

            const r = repl.start({prompt: Chalk.red.bold(" REPL > ")});
            r.context.App = App;

            r.on("exit", () => {
                Console.start();
                resolve();
            });

            App.lifecycle.on("destroyed", () => {
                if (!r) return;

                r.close();
            });

        });
    }

}
