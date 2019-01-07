import EventEmitter from "events";
import readline, {Interface} from "readline";
import Application from "../Core/Application";
import Logging, {ConsoleOutput} from "../Logging";
import BaseCommand from "./Command/BaseCommand";
import ExitCommand from "./Command/ExitCommand";
import ReplCommand from "./Command/ReplCommand";
import StatusCommand from "./Command/StatusCommand";
import ReadableStream = NodeJS.ReadableStream;
import WritableStream = NodeJS.WritableStream;

export default class Console extends EventEmitter {

    public readonly $app: Application;

    protected input: ReadableStream = process.stdin;
    protected output: WritableStream = process.stdout;
    protected paused = false;
    protected prefixForPrompt = Logging.style.prompt(" command > ");
    protected prefixForOutput = Logging.style.prompt("         < ");

    protected commands = new Map<string, Function>();
    protected readline: Interface;
    protected isPromptActive = false;

    constructor(app: Application) {
        super();
        this.$app = app;

        Logging.on("consoleLogOutput", () => {
            if (this.isPromptActive) this.waitingForCommand();
        });

        this.registerCommand(new ReplCommand());
        this.registerCommand(new ExitCommand());
        this.registerCommand(new StatusCommand());

        this.$app.attach("console", this);
    }

    public async afterInit() {
        this.start();
    }

    public async destroyed() {
        this.stop();
    }

    public route(name: string, handler: Function) {
        this.registerCommand(name, handler);
    }

    public start() {
        this.resume();
        this.readline = readline.createInterface({
            input: this.input,
            output: this.output,
        });

        this.readline.on("SIGINT", () => {
            this.$app.stop();
        });

        this.waitingForCommand();
        this.emit("initReadline");
    }

    public pause() {
        this.paused = true;
    }

    public resume() {
        if (!this.paused) return;

        this.paused = false;
    }

    public stop() {
        if (!this.readline) return;

        this.readline.close();
        this.isPromptActive = false;
        process.stdout.write("\r");
        this.emit("closeReadline");
    }

    public setInput(stream: ReadableStream) {
        this.input = stream;
        if (this.readline) (this.readline as any).input = stream;
    }

    public setOutput(stream: WritableStream) {
        this.output = stream;
        if (this.readline) (this.readline as any).output = stream;
    }

    public registerCommand(name: string | BaseCommand, handler?: Function) {
        if (name instanceof BaseCommand) {
            name.mapOfCommands((n: string | BaseCommand, h: Function) => this.registerCommand(n, h));
        } else {
            if (!handler) return;
            this.commands.set(name, handler);
        }

    }

    public error(text: ConsoleOutput) {
        this.write(Logging.style.error(text as string));
    }

    public warning(text: ConsoleOutput) {
        this.write(Logging.style.warning(text as string));
    }

    public notice(text: ConsoleOutput) {
        this.write(Logging.style.notice(text as string));
    }

    public info(text: ConsoleOutput) {
        this.write(Logging.style.info(text as string));
    }

    public write(text: ConsoleOutput) {
        if (this.paused) return;
        this.output.write("\r" + this.prefixForOutput + text + "\n");
    }

    protected waitingForCommand() {
        this.isPromptActive = true;
        this.readline.question(this.prefixForPrompt, (input) => {
            this.readline.pause();
            this.readCommand(input);
        });
    }

    protected readCommand(input: string) {
        const inputArray = input.split(" ");
        const commandName = inputArray.shift() || "";
        const args = inputArray;

        if (!this.commands.has(commandName)) {
            this.warning(`Command with name "${commandName}" does not exist`);
            return this.waitingForCommand();
        }

        this.executeCommand(commandName, args);
    }

    protected async executeCommand(name: string, args: string[]) {
        const handler = this.commands.get(name);
        if (!handler) return;

        await handler(this, args, this.$app);

        this.waitingForCommand();
    }

}
