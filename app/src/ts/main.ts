import * as fs from "fs";
import { BbtDef, isBbtDef, CmdDef } from "./def";
import { execSh } from "./sh_executor";
import 'source-map-support/register';
import { s_assertionType, s_pathSet, Option } from "./const";

function getDef(): BbtDef {
    const def = JSON.parse(fs.readFileSync(s_pathSet.Def, 'utf-8'));
    if (!isBbtDef(def)) throw Error("The bbt definition's format is invalid.");
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
        if (!Object.values(s_assertionType).includes(c.act))
            throw Error("Invalid act type is found. The operation's name is [" + def.name + "].");
        if (!ofd) {
            const resourceInput = s_pathSet.Resource + def.name + "/input/" + c.value;
            const resourceOutput = s_pathSet.Resource + def.name + "/output/" + c.value;
            if (c.act == s_assertionType.FileOutput && !fs.existsSync(resourceOutput))
                throw Error("Resource file lacks. The operation's name is [" + def.name + "].");
            if (c.act == s_assertionType.FileUpdate
                && (!fs.existsSync(resourceInput) || !fs.existsSync(resourceOutput)))
                throw Error("Resource file lacks. The operation's name is [" + def.name + "].");
            if (c.act == s_assertionType.FileDelete && !fs.existsSync(resourceInput))
                throw Error("Resource file lacks. The operation's name is [" + def.name + "].");
        }
    });
}

function summarize(opes: CmdDef[]): boolean {
    const errList = opes.map(o => {
        const fpath = "/result/" + o.name + "/failure";
        const apath = "/result/" + o.name + "/actual";
        if (fs.existsSync(fpath))
            return {
                name: o.name,
                cause: fs.readFileSync(fpath, 'utf-8').trimEnd().split(/\n/),
                actual: fs.readFileSync(apath, 'utf-8').trimEnd().split(/\n/)
            };
        return null;
    }).filter(d => d != null);
    const summary = {
        result: errList.length == 0,
        errList: errList
    };
    console.info(JSON.stringify(summary));
    return summary.result;
}

(async () => {
    const def = getDef();
    validate(def);
    fs.mkdirSync("/result/");
    const exePromises = [];
    for (let i = 1; i <= def.operations.length; i++) {
        // mnt, def, resource, env, index, name, option
        const ticket = execSh("execute", [
            ...Object.values(s_pathSet),
            i.toString(),
            def.operations[i - 1].name,
            def.option?.toString()]);
        exePromises.push(ticket.wait());
    }
    await Promise.all(exePromises);
    if (!summarize(def.operations)) process.exit(-1);
})().catch(e => {
    const hasCode = (o: any): o is { code: string } => o.code !== undefined && typeof o.code === "string";
    if (hasCode(e)) console.error("exit code -> " + e.code);
    if (e instanceof Error) {
        console.error(e.message);
        if (e.stack) console.error(e.stack);
    } else console.error(e);
    process.exit(-1);
})
