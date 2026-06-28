import Rating from "../models/rating.model.js";
import Application from "../models/application.model.js";
import User from "../models/user.model.js";

export const giveRating = async (req, res) => {
    try {
        const { score, review } = req.body;
        const applicationId = req.params.id;
        const userId = req.id;

        if (!score || score < 1 || score > 100) {
            return res.status(400).json({
                message: "Score 1 se 100 ke beech hona chahiye",
                success: false
            });
        }

        const application = await Application.findById(applicationId)
            .populate("job")
            .populate("applicant");

        if (!application) {
            return res.status(404).json({
                message: "Application nahi mili",
                success: false
            });
        }

        if (application.status !== "accepted") {
            return res.status(400).json({
                message: "Sirf accepted applications pe rating de sakte hain",
                success: false
            });
        }

        const isMaalik = application.job.postedBy.toString() === userId;
        const isKaamgar = application.applicant._id.toString() === userId;

        if (!isMaalik && !isKaamgar) {
            return res.status(403).json({
                message: "Aap rating nahi de sakte",
                success: false
            });
        }

        if (isMaalik && application.isRatedByMaalik) {
            return res.status(400).json({
                message: "Aap pehle se rating de chuke hain",
                success: false
            });
        }

        if (isKaamgar && application.isRatedByKaamgar) {
            return res.status(400).json({
                message: "Aap pehle se rating de chuke hain",
                success: false
            });
        }

        const ratedTo = isMaalik
            ? application.applicant._id
            : application.job.postedBy;

        const rating = await Rating.create({
            application: applicationId,
            ratedBy: userId,
            ratedTo,
            score,
            review,
            raterRole: isMaalik ? "maalik" : "kaamgar"
        });

        if (isMaalik) application.isRatedByMaalik = true;
        if (isKaamgar) application.isRatedByKaamgar = true;
        await application.save();

        const allRatings = await Rating.find({ ratedTo });
        const totalScore = allRatings.reduce((sum, r) => sum + r.score, 0);
        const average = Math.round(totalScore / allRatings.length);

        await User.findByIdAndUpdate(ratedTo, {
            "trustScore.average": average,
            "trustScore.totalRatings": allRatings.length
        });

        return res.status(201).json({
            message: "Rating de di!",
            success: true,
            rating
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const getUserRatings = async (req, res) => {
    try {
        const ratings = await Rating.find({ ratedTo: req.params.userId })
            .populate("ratedBy", "fullname city profile")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            ratings
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};