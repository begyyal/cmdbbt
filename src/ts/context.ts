import * as fs from "fs";
import * as path from "path";
import { BbtDef, isBbtDef, CmdDef, Check } from "./def";

export class BbtContext {

    public readonly rootPath: string;
    public readonly workPath: string;
    public readonly assetPath: string;
    public readonly def: BbtDef;

    constructor(defArg: string) {

        const defPath = defArg ? defArg : path.resolve(".") + "/bbtdef.json";
        this.rootPath = path.dirname(defPath);
        this.workPath = __dirname + "/work/"
        this.def = JSON.parse(fs.readFileSync(defPath, 'utf-8')) as BbtDef;
        this.assetPath = this.rootPath + this.def.asset;

        if (!isBbtDef(this.def))
            throw Error("The bbt definition's format is invalid.");
    }
}