"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const context_1 = require("./context");
const sh_executor_1 = require("./sh_executor");
const const_1 = require("./const");
let workPath;
function owata_(promise) {
    return promise.catch(e => {
        const hasCode = (o) => {
            return o.code !== undefined && typeof o.code === "string";
        };
        if (hasCode(e))
            console.error("exit code -> " + e.code);
        console.error(e instanceof Error ? e.message : e);
        if (workPath)
            fs.rmSync(workPath, { force: true, recursive: true });
        process.exit(-1);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const context = new context_1.BbtContext(process.argv[2]);
        workPath = context.workPath;
        if (fs.existsSync(workPath))
            throw Error("May be working other process just now.");
        fs.mkdirSync(workPath);
        validate(context);
        constructEnv(context);
        yield (0, sh_executor_1.execSh)("ready", [workPath, context.defPath]).wait();
        // let count = context.def.operations.length;
        // for (let i = 1; i <= context.def.operations.length; i++) {
        //     let ticket = execSh("execute", [workPath, `${i}`]);
        //     ticket.wait().then(() => {
        //         count--;
        //         ticket.process;
        //     }).catch(() => {
        //         throw Error("Error occured in execute.sh.");
        //     });
        // }
        // while (count > 0) await sleep(1);
        //fs.rmSync(context.workPath, { force: true, recursive: true });
    });
}
function sleep(sec) {
    return new Promise((resolve) => setTimeout(resolve, sec * 1000));
}
function validate(context) {
    const nameSet = new Set(context.def.operations.map(o => o.name));
    if (nameSet.size != context.def.operations.length)
        throw Error("The operation's name must not be duplicated.");
    context.def.operations.forEach(o => validatePerOpe(o, context.resourcePath));
}
function validatePerOpe(def, resourcePath) {
    def.expected.forEach(c => {
        if (!const_1.AssertionType.values.includes(c.act))
            throw Error("Invalid act type is found. The operation's name is [" + def.name + "].");
        if (c.act == const_1.AssertionType.FILE_OUTPUT
            && !fs.existsSync(resourcePath + "/output/" + c.value))
            throw Error("Resource files lack. The operation's name is [" + def.name + "].");
        if (c.act == const_1.AssertionType.FILE_UPDATE
            && (!fs.existsSync(resourcePath + "/input/" + c.value)
                || !fs.existsSync(resourcePath + "/output/" + c.value)))
            throw Error("Resource files lack. The operation's name is [" + def.name + "].");
        if (c.act == const_1.AssertionType.FILE_DELETE
            && !fs.existsSync(resourcePath + "/input/" + c.value))
            throw Error("Resource files lack. The operation's name is [" + def.name + "].");
    });
}
function constructEnv(context) {
    fs.mkdirSync(context.envPath);
    context.def.need.forEach(n => {
        const needPath = context.rootPath + n;
        if (n.includes(path.sep))
            fs.mkdirSync(context.envPath + path.parse(n).dir, { recursive: true });
        fs.copyFileSync(needPath, context.envPath + n);
    });
}
owata_(main());
