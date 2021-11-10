export class AssertionType {

    public static readonly CONSOLE_OUTPUT = "console-output";
    public static readonly FILE_OUTPUT = "file-output";
    public static readonly FILE_UPDATE = "file-update";
    public static readonly FILE_DELETE = "file-delete";

    public static readonly values = [
        AssertionType.CONSOLE_OUTPUT,
        AssertionType.FILE_OUTPUT,
        AssertionType.FILE_UPDATE,
        AssertionType.FILE_DELETE
    ];
}

export class PathConstants {

    public static readonly WORK = "/mnt/work/";
    public static readonly DEF = "/mnt/work/bbtdef.json";
    public static readonly RESOURCE = "/mnt/work/resource/";
    public static readonly ENV = "/mnt/work/env/";

    public static readonly values = [
        PathConstants.WORK,
        PathConstants.DEF,
        PathConstants.RESOURCE,
        PathConstants.ENV
    ];
}
