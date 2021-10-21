import * as fs from "fs";
import * as path from "path";
import { BbtDef, isBbtDef, CmdDef, Check } from "./def";

export class BbtContext {

    public readonly rootPath: string;
    public readonly workPath: string;
    public readonly resourcePath: string;
    public readonly envPath: string;

    public readonly def: BbtDef;

    constructor(defArg: string) {

        const defPath = defArg ? defArg : path.resolve(".") + "/bbtdef.json";
        this.rootPath = path.dirname(defPath);
        this.workPath = __dirname + "/work/"
        this.def = JSON.parse(fs.readFileSync(defPath, 'utf-8')) as BbtDef;
        this.resourcePath = this.rootPath + this.def.resource;
        this.envPath = this.workPath + "/env/";

        if (!isBbtDef(this.def))
            throw Error("The bbt definition's format is invalid.");
    }
}