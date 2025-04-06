import mongoose from "mongoose";

// Function to format IP addresses before saving - ensures only IPv4 is stored
function formatIpAddress(ip) {
    if (!ip) return "unknown";

    // If it's an IPv6 format with embedded IPv4, extract the IPv4 part
    if (ip.includes('::ffff:')) {
        return ip.split('::ffff:')[1];
    }

    // If it's the IPv6 loopback address, convert to IPv4 loopback
    if (ip === '::1') {
        return '127.0.0.1';
    }

    // Check if it's a pure IPv4 address (has 3 dots)
    if (/^\d+\.\d+\.\d+\.\d+$/.test(ip)) {
        return ip;
    }

    // For any other IPv6 address, return a standard IPv4 placeholder
    if (ip.includes(':')) {
        return "0.0.0.0";
    }

    return ip;
}

// Check if the model is already defined to prevent recompilation
const LoginLog = mongoose.models.LoginLog || mongoose.model("LoginLog", new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    role: {
        type: String,
        enum: ["admin", "manager", "member", "unknown"],
        default: "unknown",
    },
    status: {
        type: String,
        enum: ["success", "failed"],
        required: true,
    },
    failureReason: {
        type: String,
    },
    ipAddress: {
        type: String,
        set: formatIpAddress // Format IP address before saving
    },
    userAgent: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}));

export default LoginLog; 