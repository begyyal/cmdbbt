import * as fs from "fs";
import * as path from "path";
import { BbtDef, isBbtDef, CmdDef, Check } from "./def";
import { execSh } from "./sh_executor";

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

    const defPath = process.argv[2] ? process.argv[2] : path.resolve(".") + "/bbtdef.json";
    const rootPath = path.dirname(defPath);
    const def = JSON.parse(fs.readFileSync(defPath, 'utf-8')) as BbtDef;
    if (!isBbtDef(def))
        throw Error("The bbt definition's format is invalid.");

    // 0 - bbtdef.json/needの資産をworkにcopy
    // TODO これだけならfsのcopyFileでいい
    await execSh("setup", def.need).wait();

    // --- 以下をテストケース毎に/マルチプロセスで並列に捌きたい
    // 1 - inputディレクトリをworkにcopy
    // 2 - workにcdしてコマンドをそのまま叩く
    // 3 - outputディレクトリを用いて期待値を突合する

    console.log(def.operations[0].command);
}

owata_(main());
