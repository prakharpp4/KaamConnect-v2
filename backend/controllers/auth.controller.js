import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, phone, password, role, city, district } = req.body;

        if (!fullname || !phone || !password || !role || !city || !district) {
            return res.status(400).json({
                message: "Sabhi fields bharna zaroori hai",
                success: false
            });
        }

        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({
                message: "Is phone number se pehle se account hai",
                success: false
            });
        }

        let photoUrl = "";
        if (req.file) {
            const fileUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
            const result = await cloudinary.uploader.upload(fileUri);
            photoUrl = result.secure_url;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullname,
            phone,
            password: hashedPassword,
            role,
            city,
            district,
            profile: {
                photo: photoUrl
            }
        });

        return res.status(201).json({
            message: `Swagat hai ${fullname}! Account ban gaya.`,
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

export const login = async (req, res) => {
    try {
        const { phone, password, role } = req.body;

        if (!phone || !password || !role) {
            return res.status(400).json({
                message: "Sabhi fields bharna zaroori hai",
                success: false
            });
        }

        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).json({
                message: "Galat phone number ya password",
                success: false
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Galat phone number ya password",
                success: false
            });
        }

        if (user.role !== role) {
            return res.status(400).json({
                message: "Galat role select kiya hai",
                success: false
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "7d" }
        );

        return res.status(200)
            .cookie("token", token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            .json({
                message: `Wapas aaye ${user.fullname}!`,
                success: true,
                user: {
                    _id: user._id,
                    fullname: user.fullname,
                    phone: user.phone,
                    role: user.role,
                    city: user.city,
                    district: user.district,
                    profile: user.profile,
                    trustScore: user.trustScore
                }
            });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200)
            .cookie("token", "", { maxAge: 0 })
            .json({
                message: "Logout ho gaye!",
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

export const updateProfile = async (req, res) => {
    try {
        const { fullname, city, district, bio, skills } = req.body;
        const userId = req.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User nahi mila",
                success: false
            });
        }

        let photoUrl = user.profile.photo;
        if (req.file) {
            const fileUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
            const result = await cloudinary.uploader.upload(fileUri);
            photoUrl = result.secure_url;
        }

        if (fullname) user.fullname = fullname;
        if (city) user.city = city;
        if (district) user.district = district;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skills.split(",").map(s => s.trim());
        user.profile.photo = photoUrl;

        await user.save();

        return res.status(200).json({
            message: "Profile update ho gaya!",
            success: true,
            user: {
                _id: user._id,
                fullname: user.fullname,
                phone: user.phone,
                role: user.role,
                city: user.city,
                district: user.district,
                profile: user.profile,
                trustScore: user.trustScore
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User nahi mila",
                success: false
            });
        }
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};