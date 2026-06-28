import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["kaamgar", "maalik"],
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
    profile: {
        bio: String,
        skills: [String],
        photo: {
            type: String,
            default: ""
        },
    },
    trustScore: {
        average: {
            type: Number,
            default: 0
        },
        totalRatings: {
            type: Number,
            default: 0
        }
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);