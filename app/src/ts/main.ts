import * as fs from "fs";
import { BbtDef, isBbtDef, CmdDef } from "./def";
import { execSh } from "./sh_executor";
import { AssertionType, PathConstants, Option } from "./const";

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

    let exePromises = [];
    for (let i = 1; i <= def.operations.length; i++) {
        let args: string[] = [];
        // mnt, def, resource, env, index, option
        const ticket = execSh("execute", args.concat(
            PathConstants.values,
            i.toString(),
            def.option.toString()));
        exePromises.push(ticket.wait());
    }

    await Promise.all(exePromises);
    
    // /work/[testname]/failure で結果確認および出力
}

function getDef(): BbtDef {
    let def = JSON.parse(fs.readFileSync(PathConstants.DEF, 'utf-8'));
    if (!isBbtDef(def))
        throw Error("The bbt definition's format is invalid.");
    return def;
}

function checkOptFlag(opt: number, flag: number): boolean {
    return (opt & flag) == flag;
}

function validate(def: BbtDef): void {

    const nameSet = new Set(def.operations.map(o => o.name));
    if (nameSet.size != def.operations.length)
        throw Error("The operation's name must not be duplicated.");

    const ofd = checkOptFlag(def.option, Option.OFD);
    def.operations.forEach(o => validatePerOpe(o, ofd));
}

function validatePerOpe(def: CmdDef, ofd: boolean): void {
    def.expected.forEach(c => {

        if (!AssertionType.values.includes(c.act))
            throw Error("Invalid act type is found. The operation's name is [" + def.name + "].");

        if (!ofd) {
            const resourceInput = PathConstants.RESOURCE + def.name + "/input/" + c.value;
            const resourceOutput = PathConstants.RESOURCE + def.name + "/output/" + c.value;
            if (c.act == AssertionType.FILE_OUTPUT && !fs.existsSync(resourceOutput))
                throw Error("Resource file lacks. The operation's name is [" + def.name + "].");
            if (c.act == AssertionType.FILE_UPDATE
                && (!fs.existsSync(resourceInput) || !fs.existsSync(resourceOutput)))
                throw Error("Resource file lacks. The operation's name is [" + def.name + "].");
            if (c.act == AssertionType.FILE_DELETE && !fs.existsSync(resourceInput))
                throw Error("Resource file lacks. The operation's name is [" + def.name + "].");
        }
    });
}

owata_(main());
