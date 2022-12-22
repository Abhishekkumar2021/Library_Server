import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import User from '../models/UserModel';
import ErrorResponse from '../utils/ErrorResponse';
import  jwt  from 'jsonwebtoken';

async function hashPassword(password: string) {
    if(!password) return "";
    return await bcrypt.hash(password, 10);
}

async function comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
}

function sendTokenResponse(user: any, statusCode: number, res: Response) {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(
            Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE as string) as number
        ),
        httpOnly: true,
        withCredentials: true,
    };
    res.statusCode = statusCode;
    res.cookie("token", token, options);
    res.json({
        success: true,
        token,
    });
}


export async function Login(
    req: Request,
    res: Response,
    next: NextFunction
){
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorResponse("Please provide an email and password", 400));
    }
    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorResponse("Invalid credentials", 401));
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return next(new ErrorResponse("Invalid credentials", 401));
        }
        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
}

export async function Register(
    req: Request,
    res: Response,
    next: NextFunction
){
    const { name, email, password, role, adminSecret } = req.body;
    const hashedPassword = await hashPassword(password);
    if(password?.length < 6) {
        return next(new ErrorResponse("Password must be at least 6 characters", 400));
    }
    if(role === "admin" && adminSecret as string !== process.env.ADMIN_SECRET as string) {
        return next(new ErrorResponse("Invalid admin secret", 400));
    }

    try {
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
        res.status(201).json({
            success: true,
            data: user,
        });
    } catch (err) {
        next(err);
    }
}

export async function Logout(
    req: Request,
    res: Response,
    next: NextFunction
){
    const options = {
        expires: new Date(
            Date.now() + 10 * 1000
        ),
        httpOnly: true,
        withCredentials: true,
    };
    res.cookie("token", "none", options);
    res.status(200).json({
        success: true,
        data: {},
    });
}


type Token = {
    id: string;
}

export async function GetMe(
    req: Request,
    res: Response,
    next: NextFunction
){
    const token = req.cookies.token;
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as Token;
    const user = await User.findById(decoded.id);
    res.status(200).json({
        success: true,
        data: user,
    });
}
