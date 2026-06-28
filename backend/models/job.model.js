import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: [
            "Helper / Kaam wala",
            "Driver",
            "Compounder / Medical helper",
            "Cook / Khana banana",
            "Guard / Chowkidar",
            "Cleaner / Safai wala",
            "Shop assistant",
            "Delivery boy",
            "Tutor / Padhai"
        ],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    payType: {
        type: String,
        enum: ["daily", "monthly"],
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    jobType: {
        type: String,
        enum: ["Full Time", "Part Time", "Work From Home"],
        required: true
    },
    whatsapp: {
        type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application"
    }]
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);