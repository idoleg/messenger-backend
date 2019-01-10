import {Chalk as ChalkInterface} from "chalk";
import EventEmitter from "events";
import moment from "moment";
import PrettyError from "pretty-error";
import Chalk from "./Chalk";
import WriteStream = NodeJS.WriteStream;

interface IConsoleDecor {
    error: ChalkInterface;
    warning: ChalkInterface;
    notice: ChalkInterface;
    info: ChalkInterface;
    prefix: ChalkInterface;
    prompt: ChalkInterface;
}

export type ConsoleOutput = ChalkInterface | string | number | boolean | object;

class Logging extends EventEmitter {

    public pe = new PrettyError();
    public output: WriteStream = process.stdout;

    public style: IConsoleDecor = {
        error: Chalk.red,
        info: Chalk.white,
        notice: Chalk.green,
        warning: Chalk.yellow,

        prefix: Chalk.gray,
        prompt: Chalk.red.bold,
    };
    private paused: boolean = false;

    constructor() {
        super();
        if (!process.env.APP_DEBUG) this.pause();
    }

    public pause() {
        this.paused = true;
    }

    public resume() {
        this.paused = false;
    }

    public setOutput(stream: WriteStream) {
        this.output = stream;
    }

    public prefixForOutput() {
        return this.style.prefix("[" + moment().format("HH:mm:ss") + "] ");
    }

    public error(text: ConsoleOutput) {
        this.write(this.style.error(text as string));
    }

    public warning(text: ConsoleOutput) {
        this.write(this.style.warning(text as string));
    }

    public notice(text: ConsoleOutput) {
        this.write(this.style.notice(text as string));
    }

    public info(text: ConsoleOutput) {
        this.write(this.style.info(text as string));
    }

    public write(text: ConsoleOutput) {
        if (this.paused) {
            return;
        }

        this.output.write("\r" + this.prefixForOutput() + text + "\n");
        this.emit("consoleLogOutput", text);
    }

    public renderError(error: object) {
        if (this.paused) {
            return;
        }

        this.output.write("\r" + this.pe.render(error));
    }

}

export default new Logging();
