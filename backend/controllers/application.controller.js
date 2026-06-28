import Application from "../models/application.model.js";
import Job from "../models/job.model.js";

export const applyJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job nahi mili",
                success: false
            });
        }

        const existing = await Application.findOne({ job: jobId, applicant: userId });
        if (existing) {
            return res.status(400).json({
                message: "Aapne pehle se apply kar diya hai",
                success: false
            });
        }

        const application = await Application.create({
            job: jobId,
            applicant: userId
        });

        job.applications.push(application._id);
        await job.save();

        return res.status(201).json({
            message: "Apply ho gaya!",
            success: true,
            application
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.id })
            .populate({
                path: "job",
                populate: {
                    path: "postedBy",
                    select: "fullname city trustScore profile"
                }
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            applications
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const getJobApplications = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({
                message: "Job nahi mili",
                success: false
            });
        }

        if (job.postedBy.toString() !== req.id) {
            return res.status(403).json({
                message: "Aap is job ke applications nahi dekh sakte",
                success: false
            });
        }

        const applications = await Application.find({ job: req.params.id })
            .populate("applicant", "fullname phone city district profile trustScore")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            applications
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id)
            .populate("job");

        if (!application) {
            return res.status(404).json({
                message: "Application nahi mili",
                success: false
            });
        }

        if (application.job.postedBy.toString() !== req.id) {
            return res.status(403).json({
                message: "Aap status nahi badal sakte",
                success: false
            });
        }

        application.status = status;
        await application.save();

        return res.status(200).json({
            message: `Application ${status} ho gaya!`,
            success: true,
            application
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};