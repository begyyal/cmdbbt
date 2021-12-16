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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BbtContext = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const def_1 = require("./def");
class BbtContext {
    constructor(defArg) {
        this.defPath = defArg ? defArg : path.resolve(".") + "/bbtdef.json";
        this.rootPath = path.dirname(this.defPath) + "/";
        this.workPath = __dirname + "/../work/";
        this.def = JSON.parse(fs.readFileSync(this.defPath, 'utf-8'));
        this.resourcePath = this.rootPath + this.def.resource;
        this.envPath = this.workPath + "env/";
        if (!(0, def_1.isBbtDef)(this.def))
            throw Error("The bbt definition's format is invalid.");
    }
}
exports.BbtContext = BbtContext;
