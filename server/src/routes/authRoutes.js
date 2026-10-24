import { Router } from "express";
import { getMe, logIn, logOut, signUp } from "../controllers/authController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/logout", logOut);
router.get("/me", requireAuth, getMe);

export default router;
