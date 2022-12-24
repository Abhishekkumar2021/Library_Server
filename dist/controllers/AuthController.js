"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMe = exports.Logout = exports.Register = exports.Login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const ErrorResponse_1 = __importDefault(require("../utils/ErrorResponse"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!password)
            return "";
        return yield bcryptjs_1.default.hash(password, 10);
    });
}
function comparePassword(password, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(password, hashedPassword);
    });
}
function sendTokenResponse(user, statusCode, res) {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE)),
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
function Login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorResponse_1.default("Please provide an email and password", 400));
        }
        try {
            const user = yield UserModel_1.default.findOne({ email }).select("+password");
            if (!user) {
                return next(new ErrorResponse_1.default("Invalid credentials", 401));
            }
            const isMatch = yield comparePassword(password, user.password);
            if (!isMatch) {
                return next(new ErrorResponse_1.default("Invalid credentials", 401));
            }
            sendTokenResponse(user, 200, res);
        }
        catch (err) {
            next(err);
        }
    });
}
exports.Login = Login;
function Register(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, password, role, secret } = req.body;
        const hashedPassword = yield hashPassword(password);
        if ((password === null || password === void 0 ? void 0 : password.length) < 6) {
            return next(new ErrorResponse_1.default("Password must be at least 6 characters", 400));
        }
        console.log(role, secret, process.env.ADMIN_SECRET);
        if (role === "admin" && secret !== process.env.ADMIN_SECRET) {
            return next(new ErrorResponse_1.default("Invalid admin secret", 400));
        }
        try {
            const user = yield UserModel_1.default.create({
                name,
                email,
                password: hashedPassword,
                role,
            });
            res.status(201).json({
                success: true,
                data: user,
            });
        }
        catch (err) {
            next(err);
        }
    });
}
exports.Register = Register;
function Logout(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
            withCredentials: true,
        };
        res.cookie("token", "none", options);
        res.status(200).json({
            success: true,
            data: {},
        });
    });
}
exports.Logout = Logout;
function GetMe(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies.token;
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield UserModel_1.default.findById(decoded.id);
        res.status(200).json({
            success: true,
            data: user,
        });
    });
}
exports.GetMe = GetMe;
