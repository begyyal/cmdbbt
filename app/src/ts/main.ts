import * as fs from "fs";
import { BbtDef, isBbtDef, CmdDef } from "./def";
import { execSh } from "./sh_executor";
import { AssertionType, PathConstants } from "./const";

function owata_(promise: Promise<any>) {
    return promise.catch(e => {

        const hasCode = (o: any): o is { code: string } => {
            return o.code !== undefined && typeof o.code === "string"
        };
        if (hasCode(e))
            console.error("exit code -> " + e.code);
        console.error(e instanceof Error ? e.message : e);

        process.exit(-1);
    });
}

async function main() {

    let def = getDef();

    validate(def);

    for (let i = 1; i <= def.operations.length; i++) {
        let args : string[] = [];
        // work, def, resource, env, index
        execSh("execute", args.concat(PathConstants.values, i.toString()));
    }
}

function getDef(): BbtDef {
    let def = JSON.parse(fs.readFileSync(PathConstants.DEF, 'utf-8'));
    if (!isBbtDef(def))
        throw Error("The bbt definition's format is invalid.");
    return def;
}

function validate(def: BbtDef): void {

    const nameSet = new Set(def.operations.map(o => o.name));
    if (nameSet.size != def.operations.length)
        throw Error("The operation's name must not be duplicated.");

    def.operations.forEach(o => validatePerOpe(o));
}

function validatePerOpe(def: CmdDef): void {
    def.expected.forEach(c => {

        if (!AssertionType.values.includes(c.act))
            throw Error("Invalid act type is found. The operation's name is [" + def.name + "].");

        if (c.act == AssertionType.FILE_OUTPUT
            && !fs.existsSync(PathConstants.RESOURCE + "output/" + c.value))
            throw Error("Resource files lack. The operation's name is [" + def.name + "].");
        if (c.act == AssertionType.FILE_UPDATE
            && (!fs.existsSync(PathConstants.RESOURCE + "input/" + c.value)
                || !fs.existsSync(PathConstants.RESOURCE + "output/" + c.value)))
            throw Error("Resource files lack. The operation's name is [" + def.name + "].");
        if (c.act == AssertionType.FILE_DELETE
            && !fs.existsSync(PathConstants.RESOURCE + "input/" + c.value))
            throw Error("Resource files lack. The operation's name is [" + def.name + "].");
    });
}

owata_(main());
