import DBInstance from "@/utils/db";
import User from "@/utils/models/user.model";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    try {
        await DBInstance();

        const { name, email, password, position, domain } = req.body;

        // Validate required fields
        if (!name || !email || !password || !position || !domain) {
            return res.status(400).json({
                success: false,
                error: "All fields are required",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "Email already registered",
            });
        }

        // Create new user with isApproved set to false
        const newUser = new User({
            name,
            email,
            password,
            position,
            domain,
            isApproved: false, // All users need admin approval
            role: position === "President" || position === "Vice President"
                ? "admin"
                : position === "Director" || position === "Lead"
                    ? "manager"
                    : "member"
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "User registered successfully. Pending admin approval.",
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                position: newUser.position,
                domain: newUser.domain,
                role: newUser.role,
                isApproved: newUser.isApproved,
            },
        });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to register user",
        });
    }
} 