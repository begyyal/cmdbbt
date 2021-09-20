import { exec, ExecException, ChildProcess } from "child_process";

const SH_DIR = __dirname + "/sh/";
const TIMEOUT_SEC = 180;
const SLEEP_INTERVAL = 0.5;

export class Ticket {
    end: boolean = false;
    process: ChildProcess | null = null;
    async wait() {
        let count = TIMEOUT_SEC * (1 / SLEEP_INTERVAL);
        while (!this.end && count-- > 0)
            await sleep(0.5);
    }
}

function sleep(sec: number) {
    return new Promise((resolve) => setTimeout(resolve, sec * 1000));
}

export function execSh(exeName: string, args: string[] = []): Ticket {
    let tic = new Ticket();
    let cb = (error: ExecException | null, stdout: string | Buffer, stderr: string | Buffer) => {
        if (error)
            throw error;
        if (stdout)
            console.log(stdout);
        tic.end = true;
    };
    tic.process = exec(SH_DIR + exeName + ".sh " + args.join(" "), { }, cb);
    return tic;
}
