import DBInstance from "@/utils/db";
import DB from "@/utils/db"
import User from "@/utils/models/user.model";
import LoginLog from "@/utils/models/loginLog.model";
import { generateToken } from "@/utils/auth";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        await DB.DBInstance();

        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        // For all users
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check if user is approved
        if (!user.isApproved) {
            return res.status(403).json({ message: "Your account is pending approval" });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            // Create login log for failed attempt
            await LoginLog.create({
                user: user._id,
                email: user.email,
                role: user.role,
                status: "failed",
                failureReason: "Invalid password",
                ipAddress: getClientIp(req),
                userAgent: req.headers["user-agent"],
            });

            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create login log for successful attempt
        await LoginLog.create({
            user: user._id,
            email: user.email,
            role: user.role,
            status: "success",
            ipAddress: getClientIp(req),
            userAgent: req.headers["user-agent"],
        });

        // Generate JWT token
        const token = generateToken(user);

        // Set token in cookie
        res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`);

        // Return user data
        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                position: user.position,
                domain: user.domain,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Helper function to get client IP address
function getClientIp(req) {
    // In Next.js, the x-forwarded-for header is the most reliable source for the real IP
    // It contains a comma-separated list of IPs, with the original client IP being first
    const forwarded = req.headers["x-forwarded-for"];
    if (forwarded) {
        // Get the first IP in the list (the original client IP)
        const ips = forwarded.split(',').map(ip => ip.trim());
        const clientIp = ips[0];

        // If it's an IPv4, return as is
        if (/^\d+\.\d+\.\d+\.\d+$/.test(clientIp)) {
            return clientIp;
        }

        // Handle IPv6 formats
        if (clientIp.includes('::ffff:')) {
            return clientIp.split('::ffff:')[1];
        }
        if (clientIp === '::1') {
            return '127.0.0.1';
        }
    }

    // Fallback to other headers if x-forwarded-for is not available
    const realIp = req.headers["x-real-ip"];
    if (realIp) {
        return realIp;
    }

    // Last resort: direct connection IP
    const directIp = req.connection?.remoteAddress || req.socket?.remoteAddress;
    if (directIp) {
        if (directIp.includes('::ffff:')) {
            return directIp.split('::ffff:')[1];
        }
        if (directIp === '::1') {
            return '127.0.0.1';
        }
        if (/^\d+\.\d+\.\d+\.\d+$/.test(directIp)) {
            return directIp;
        }
    }

    // If no valid IP is found
    return "0.0.0.0";
} 