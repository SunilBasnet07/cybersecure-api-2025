import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
    },
    address: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 30,
    },
    assistanceName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,

    },
    password: {
        type: String,
        minlength: 8,


    },
    confirmPassword: {
        type: String,
        minlength: 8,
    },
    otp: {
        type: String,
        default: null,
    },
    expireAt: {
        type: Date,
        default: () => new Date(Date.now() + 60000),
    },
    isVerified: {
        type: Boolean,
        default: false,
    },

    profileImageUrl: String,
    roles: {
        type: [String],
        uppercase: true,
        default: ["USER"],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    lockUntil: {
        type: Date,
        default: null
    },


});

const User = mongoose.model("User", userSchema);
export default User;