
export const s_assertionType = {
    ConsoleOutput: "console-output",
    FileOutput: "file-output",
    FileUpdate: "file-update",
    FileDelete: "file-delete"
}

export const s_pathSet = {
    MntRoot: "/mnt/main/",
    Def: "/mnt/main/bbtdef.json",
    Resource: "/mnt/main/resource/",
    Env: "/mnt/main/env/"
}

export enum ResultStatus {
    OK = "ok",
    NG = "ng"
}

export class Option {
    public static readonly OFD = 1;
}
