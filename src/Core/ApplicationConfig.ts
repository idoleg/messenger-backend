import dotProp from "dot-prop";
import fs from "fs";
import {parse as parseFile} from "path";

export default class ApplicationConfig {

    private config: object = {};

    public async loadFromFile(fileName: string) {
        const stat = await fs.promises.lstat(fileName);

        if (stat.isDirectory()) {
            const files = await fs.promises.readdir(fileName);

            for await (const file of files) {
                await this.loadFromFile(fileName + "/" + file);
            }

            return;
        }

        const data = await import(fileName);
        const name = parseFile(fileName).name;
        this.set(name, data.default);
    }

    public get(path: string, defaultValue?: any): any {
        return dotProp.get(this.config, path, defaultValue);
    }

    public set(path: string, value: any): void {
        dotProp.set(this.config, path, value);
    }

    public has(path: string): boolean {
        return dotProp.has(this.config, path);
    }

    public delete(path: string): void {
        dotProp.delete(this.config, path);
    }
}
