"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorResponse_1 = __importDefault(require("../utils/ErrorResponse"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authHandler(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return next(new ErrorResponse_1.default("Not authorized to access this route", 401));
    }
    try {
        // Verify token
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    catch (err) {
        return next(new ErrorResponse_1.default("Not authorized to access this route", 401));
    }
    next();
}
exports.default = authHandler;
