import { Router } from "express";
import { register, login, logout, getMe, deleteUser } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/me', authenticate, getMe); // --- checks auth cookie
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.delete('/me', authenticate, deleteUser);

export default router;