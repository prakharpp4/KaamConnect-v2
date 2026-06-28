import express from "express";
import { register, login, logout, updateProfile, getUserProfile } from "../controllers/auth.controller.js";
import isAuthenticated from "../middleware/auth.middleware.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

router.post("/register", upload.single("photo"), register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.put("/profile/update", isAuthenticated, upload.single("photo"), updateProfile);
router.get("/profile/:id", getUserProfile);

export default router;