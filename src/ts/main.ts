import * as fs from "fs";
import * as path from "path";
import { BbtDef, isBbtDef, CmdDef, Check } from "./def";
import { BbtContext } from "./context";
import { execSh } from "./sh_executor";
import { AssertionType } from "./const";

let workPath: string;

function owata_(promise: Promise<any>) {
    return promise.catch(e => {

        const hasCode = (o: any): o is { code: string } => {
            return o.code !== undefined && typeof o.code === "string"
        };
        if (hasCode(e))
            console.error("exit code -> " + e.code);
        console.error(e instanceof Error ? e.message : e);

        if (workPath)
            fs.rmSync(workPath, { force: true, recursive: true });
        process.exit(-1);
    });
}

async function main() {

    const context = new BbtContext(process.argv[2]);
    workPath = context.workPath;

    if (fs.existsSync(workPath))
        throw Error("May be working other process just now.");
    fs.mkdirSync(workPath);

    validate(context);
    constructEnv(context);

    await execSh("ready", [workPath, context.defPath]).wait();

    let count = context.def.operations.length;
    for (let i = 1; i <= context.def.operations.length; i++) {
        let ticket = execSh("execute", [workPath, `${i}`]);
        ticket.wait().then(() => {
            count--;
            ticket.process;


        }).catch(() => {
            throw Error("Error occured in execute.sh.");
        });
    }

    while (count > 0) await sleep(1);




    fs.rmSync(context.workPath, { force: true, recursive: true });
}

function sleep(sec: number) {
    return new Promise((resolve) => setTimeout(resolve, sec * 1000));
}

function validate(context: BbtContext): void {

    const nameSet = new Set(context.def.operations.map(o => o.name));
    if (nameSet.size != context.def.operations.length)
        throw Error("The operation's name must not be duplicated.");

    context.def.operations.forEach(o => validatePerOpe(o, context.resourcePath));
}

function validatePerOpe(def: CmdDef, resourcePath: string): void {
    def.expected.forEach(c => {

        if (!AssertionType.values.includes(c.act))
            throw Error("Invalid act type is found. The operation's name is [" + def.name + "].");

        if (c.act == AssertionType.FILE_OUTPUT
            && !fs.existsSync(resourcePath + "/output/" + c.value))
            throw Error("Resource files lack. The operation's name is [" + def.name + "].");
        if (c.act == AssertionType.FILE_UPDATE
            && (!fs.existsSync(resourcePath + "/input/" + c.value)
                || !fs.existsSync(resourcePath + "/output/" + c.value)))
            throw Error("Resource files lack. The operation's name is [" + def.name + "].");
        if (c.act == AssertionType.FILE_DELETE
            && !fs.existsSync(resourcePath + "/input/" + c.value))
            throw Error("Resource files lack. The operation's name is [" + def.name + "].");
    });
}

function constructEnv(context: BbtContext): void {
    fs.mkdirSync(context.envPath);
    context.def.need.forEach(n => {
        const needPath = context.rootPath + n;
        if (n.includes(path.sep))
            fs.mkdirSync(context.envPath + path.parse(n).dir, { recursive: true });
        fs.copyFileSync(needPath, path.parse(context.envPath + n).dir, fs.constants.COPYFILE_FICLONE_FORCE);
    });
}

owata_(main());
