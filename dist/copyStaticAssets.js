"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shelljs_1 = __importDefault(require("shelljs"));
shelljs_1.default.cp('-R', 'src/templates/email', 'dist/src/templates');
//# sourceMappingURL=copyStaticAssets.js.map