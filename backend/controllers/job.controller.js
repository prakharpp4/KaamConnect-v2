import Job from "../models/job.model.js";

export const postJob = async (req, res) => {
    try {
        const { title, category, description, city, district, payType, salary, jobType, whatsapp } = req.body;

        if (!title || !category || !description || !city || !district || !payType || !salary || !jobType || !whatsapp) {
            return res.status(400).json({
                message: "Sabhi fields bharna zaroori hai",
                success: false
            });
        }

        const job = await Job.create({
            title,
            category,
            description,
            city,
            district,
            payType,
            salary,
            jobType,
            whatsapp,
            postedBy: req.id
        });

        return res.status(201).json({
            message: "Job post ho gaya!",
            success: true,
            job
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const getAllJobs = async (req, res) => {
    try {
        const { city, category, jobType, payType, keyword } = req.query;

        let filter = {};

        if (city) filter.city = { $regex: city, $options: "i" };
        if (category) filter.category = category;
        if (jobType) filter.jobType = jobType;
        if (payType) filter.payType = payType;
        if (keyword) {
            filter.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ];
        }

        const jobs = await Job.find(filter)
            .populate("postedBy", "fullname city district trustScore profile")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            jobs
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("postedBy", "fullname city district trustScore profile phone");

        if (!job) {
            return res.status(404).json({
                message: "Job nahi mili",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            job
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.id })
            .populate("applications")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            jobs
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const deleteJob = async (req, res) => {
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
                message: "Aap is job ko delete nahi kar sakte",
                success: false
            });
        }

        await Job.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            message: "Job delete ho gaya!",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};