import express from "express";
import { postJob, getAllJobs, getJobById, getMyJobs, deleteJob } from "../controllers/job.controller.js";
import isAuthenticated from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/post", isAuthenticated, postJob);
router.get("/all", getAllJobs);
router.get("/myjobs", isAuthenticated, getMyJobs);
router.get("/:id", getJobById);
router.delete("/:id", isAuthenticated, deleteJob);

export default router;
