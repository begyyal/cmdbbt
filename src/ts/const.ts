export class AssertionType {

    public static readonly CONSOLE_OUTPUT = "console-output";
    public static readonly FILE_OUTPUT = "file-output";
    public static readonly FILE_UPDATE = "file-update";
    public static readonly FILE_DELETE = "file-delete";

    public static values(): string[] {
        return [
            this.CONSOLE_OUTPUT,
            this.FILE_OUTPUT,
            this.FILE_UPDATE,
            this.FILE_DELETE
        ];
    }
}