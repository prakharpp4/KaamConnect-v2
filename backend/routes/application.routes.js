import express from "express";
import { applyJob, getMyApplications, getJobApplications, updateApplicationStatus } from "../controllers/application.controller.js";
import isAuthenticated from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/apply/:id", isAuthenticated, applyJob);
router.get("/my", isAuthenticated, getMyApplications);
router.get("/job/:id", isAuthenticated, getJobApplications);
router.put("/status/:id", isAuthenticated, updateApplicationStatus);

export default router;