import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/ErrorResponse";

export default function errorHandler(
    err: ErrorResponse,
    req: Request,
    res: Response,
    next: NextFunction
    ) {
    let error = { ...err }; // 
    error.message = err.message;
    const words : Array<string> = err.message.split(" ");
    
    // Log to console for dev
    console.log(`Error name : ${err.name}\nError Code : ${err.statusCode}\nError message : ${err.message}`);
    
    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        const message = `Resource not found`;
        error = new ErrorResponse(message, 404);
    }


    // Mongoose duplicate key
    if(words[0] === "E11000") {
        const message = `Email already exists!`;
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const idx = err.message.indexOf(":");
        const msg = err.message.slice(idx + 2);
        error = new ErrorResponse(msg, 400);
    }
        
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error",
    });
}