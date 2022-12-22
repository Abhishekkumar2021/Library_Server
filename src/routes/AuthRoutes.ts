import {Router} from 'express';
import { Login, Register, Logout, GetMe } from '../controllers/AuthController';
import authHandler from '../middlewares/AuthMiddleware';

const router = Router();

router.post("/login", Login);
router.post("/register", Register);
router.post("/logout", Logout);
router.get("/me", authHandler, GetMe);

export default router;