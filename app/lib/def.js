"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCheck = exports.isCmdDef = exports.isBbtDef = void 0;
function isBbtDef(def) {
    let ok = def.need !== undefined &&
        def.resource !== undefined &&
        def.operations !== undefined;
    if (ok) {
        let ope = def.operations;
        if (Array.isArray(ope))
            ok = ok && ope.every(isCmdDef);
        else
            createRequiredNonNullErr("operations");
    }
    return ok;
}
exports.isBbtDef = isBbtDef;
function isCmdDef(def) {
    let ok = def.name !== undefined
        && def.command !== undefined
        && def.expected !== undefined;
    if (ok) {
        let exp = def.expected;
        if (!def.name)
            createRequiredNonNullErr("name");
        else if (!def.command)
            createRequiredNonNullErr("command");
        else if (Array.isArray(exp))
            ok = ok && exp.every(isCheck);
        else
            createRequiredNonNullErr("expected");
    }
    return ok;
}
exports.isCmdDef = isCmdDef;
function isCheck(def) {
    const ok = def.act !== undefined
        && def.value !== undefined;
    if (ok)
        if (!def.act)
            createRequiredNonNullErr("act");
        else if (!def.value)
            createRequiredNonNullErr("value");
    return ok;
}
exports.isCheck = isCheck;
function createRequiredNonNullErr(fieldName) {
    return new Error("The [" + fieldName + "] field must be non null.");
}
