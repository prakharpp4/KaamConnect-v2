import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    application: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
        required: true
    },
    ratedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    ratedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 1,
        max: 100
    },
    review: {
        type: String,
        maxlength: 300
    },
    raterRole: {
        type: String,
        enum: ["kaamgar", "maalik"],
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Rating", ratingSchema);