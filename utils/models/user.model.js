import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Define the schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
    },
    position: {
        type: String,
        required: [true, "Position is required"],
        trim: true,
        enum: ["President", "Vice President", "Lead", "Associate", "Member"],
    },
    domain: {
        type: String,
        required: [true, "Domain is required"],
        trim: true,
        enum: ["Technical", "Creative", "Corporate", "President", "Vice President"],
    },
    role: {
        type: String,
        enum: ["admin", "manager", "member"],
        default: "member",
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    approvalDate: {
        type: Date,
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    revocationDate: {
        type: Date,
    },
    revocationReason: {
        type: String,
    },
    revokedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastLogin: {
        type: Date,
    },
});

// Add a pre-save hook to set the role based on position
userSchema.pre("save", function (next) {
    // Set role based on position
    if (this.position === "President" || this.position === "Vice President") {
        this.role = "admin";
    } else if (this.position === "Director" || this.position === "Lead") {
        this.role = "manager";
    } else {
        this.role = "member";
    }
    next();
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate password reset token
userSchema.methods.generatePasswordReset = function () {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    return this.resetPasswordToken;
};

// Check if the model is already defined to prevent recompilation
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User; 