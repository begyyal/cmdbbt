"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssertionType = void 0;
class AssertionType {
}
exports.AssertionType = AssertionType;
AssertionType.CONSOLE_OUTPUT = "console-output";
AssertionType.FILE_OUTPUT = "file-output";
AssertionType.FILE_UPDATE = "file-update";
AssertionType.FILE_DELETE = "file-delete";
AssertionType.values = [
    AssertionType.CONSOLE_OUTPUT,
    AssertionType.FILE_OUTPUT,
    AssertionType.FILE_UPDATE,
    AssertionType.FILE_DELETE
];
