"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpException extends Error {
    constructor(status, message, error) {
        super(message);
        this.status = status;
        this.message = message;
        this.error = error || null;
    }
}
exports.default = HttpException;
//# sourceMappingURL=http-exception.js.map