"use strict";
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
exports.execSh = exports.Ticket = void 0;
const child_process_1 = require("child_process");
const SH_DIR = __dirname + "/sh/";
const TIMEOUT_SEC = 180;
const SLEEP_INTERVAL = 0.5;
class Ticket {
    constructor() {
        this.end = false;
        this.process = null;
    }
    wait() {
        return __awaiter(this, void 0, void 0, function* () {
            let timeoutFlag = false;
            const start = new Date().getTime();
            while (!this.end && !timeoutFlag) {
                yield sleep(SLEEP_INTERVAL);
                timeoutFlag = new Date().getTime() - start > TIMEOUT_SEC * 1000;
            }
        });
    }
}
exports.Ticket = Ticket;
function sleep(sec) {
    return new Promise((resolve) => setTimeout(resolve, sec * 1000));
}
function execSh(exeName, args = []) {
    let tic = new Ticket();
    let cb = (error, stdout, stderr) => {
        if (error)
            throw error;
        else if (stderr)
            throw Error(stderr.toString());
        else if (stdout)
            console.log(stdout);
        tic.end = true;
    };
    tic.process = (0, child_process_1.exec)(SH_DIR + exeName + ".sh " + args.join(" "), { windowsHide: true }, cb);
    return tic;
}
exports.execSh = execSh;
