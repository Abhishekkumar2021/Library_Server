"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorResponse_1 = __importDefault(require("../utils/ErrorResponse"));
function errorHandler(err, req, res, next) {
    let error = Object.assign({}, err); // 
    error.message = err.message;
    const words = err.message.split(" ");
    // Log to console for dev
    console.log(`Error name : ${err.name}\nError Code : ${err.statusCode}\nError message : ${err.message}`);
    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        const message = `Resource not found`;
        error = new ErrorResponse_1.default(message, 404);
    }
    // Mongoose duplicate key
    if (words[0] === "E11000") {
        const message = `Email already exists!`;
        error = new ErrorResponse_1.default(message, 400);
    }
    // Mongoose validation error
    if (err.name === "ValidationError") {
        const idx = err.message.indexOf(":");
        const msg = err.message.slice(idx + 2);
        error = new ErrorResponse_1.default(msg, 400);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error",
    });
}
exports.default = errorHandler;
