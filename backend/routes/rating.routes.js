import express from "express";
import { giveRating, getUserRatings } from "../controllers/rating.controller.js";
import isAuthenticated from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/give/:id", isAuthenticated, giveRating);
router.get("/user/:userId", getUserRatings);

export default router;