import * as fs from "fs";
import * as path from "path";
import { BbtDef, isBbtDef, CmdDef, Check } from "./def";
import { BbtContext } from "./context";
import { execSh } from "./sh_executor";
import { AssertionType } from "./const";

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

    const context = new BbtContext(process.argv[2]);
    validate(context);

    fs.mkdirSync(context.workPath);
    context.def.need.forEach(n => {
        const need = context.rootPath + n;
        fs.copyFileSync(need, context.workPath, fs.constants.COPYFILE_FICLONE_FORCE);
    });

    await execSh("setup", context.def.need).wait();

    // --- 以下をテストケース毎に/マルチプロセスで並列に捌きたい
    context.def.operations.forEach(() => { });
    // 1 - inputディレクトリをworkにcopy
    // 2 - workにcdしてコマンドをそのまま叩く
    // 3 - outputディレクトリを用いて期待値を突合する




    fs.rmSync(context.workPath, { force: true, recursive: true });
}

function validate(context: BbtContext) {

    const nameSet = new Set(context.def.operations.map(o => o.name));
    if (nameSet.size != context.def.operations.length)
        throw Error("The operation's name must not be duplicated.");

    context.def.operations.forEach(o => validatePerOpe(o, context.assetPath));
}

function validatePerOpe(def: CmdDef, assetPath: string) {
    def.expected.forEach(c => {

        if (!AssertionType.values().includes(c.act))
            throw Error("Invalid act type is found. The operation's name is [" + def.name + "].");
        
        if (c.act == AssertionType.FILE_OUTPUT
            && !fs.existsSync(assetPath + "/output/" + c.value))
            throw Error("Asset file lacks. The operation's name is [" + def.name + "].");
        if (c.act == AssertionType.FILE_UPDATE
            && (!fs.existsSync(assetPath + "/input/" + c.value)
            || !fs.existsSync(assetPath + "/output/" + c.value)))
            throw Error("Asset file lacks. The operation's name is [" + def.name + "].");
        if (c.act == AssertionType.FILE_DELETE
            && !fs.existsSync(assetPath + "/input/" + c.value))
            throw Error("Asset file lacks. The operation's name is [" + def.name + "].");
    });
}

owata_(main());
