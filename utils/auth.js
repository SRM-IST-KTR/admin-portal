import jwt from "jsonwebtoken";
import { hasPermission } from "./permissions";

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'your-development-secret-key');
    } catch (error) {
        throw new Error("Invalid token");
    }
};

export const generateToken = (user) => {
    // Create the payload with user data
    const payload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };

    // Generate the token with an expiration time
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your-development-secret-key',
        { expiresIn: '1d' } // Token expires in 1 day
    );

    return token;
};

export const withAuth = (handler, allowedRoles = []) => {
    return async (req, res) => {
        try {
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({ success: false, error: "Unauthorized" });
            }

            const decoded = await verifyToken(token);

            // Store the user in the request
            req.user = decoded;

            // If allowedRoles is empty, use the new permissions system
            if (allowedRoles.length === 0) {
                const url = req.url;
                // Check if user has permission for this route
                if (!hasPermission(decoded, url, true)) {
                    return res.status(403).json({ success: false, error: "Forbidden" });
                }
            } else {
                // Legacy role-based check
                if (!allowedRoles.includes(decoded.role)) {
                    return res.status(403).json({ success: false, error: "Forbidden" });
                }
            }

            return handler(req, res);
        } catch (error) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }
    };
}; 