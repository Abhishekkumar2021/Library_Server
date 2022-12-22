"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const AuthMiddleware_1 = __importDefault(require("../middlewares/AuthMiddleware"));
const router = (0, express_1.Router)();
router.post("/login", AuthController_1.Login);
router.post("/register", AuthController_1.Register);
router.post("/logout", AuthController_1.Logout);
router.get("/me", AuthMiddleware_1.default, AuthController_1.GetMe);
exports.default = router;
