import {Request, Response, NextFunction} from 'express';
import ErrorResponse from '../utils/ErrorResponse';
import jwt from 'jsonwebtoken';

export default function authHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.cookies.token;
    if(!token) {
        return next(new ErrorResponse("Not authorized to access this route", 401));
    }
    try{
        // Verify token
        jwt.verify(token, process.env.JWT_SECRET as string); 
    } catch(err) {
        return next(new ErrorResponse("Not authorized to access this route", 401));
    }
    next();
}
