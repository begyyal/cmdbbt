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