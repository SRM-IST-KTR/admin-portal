import DBInstance from "@/utils/db";
import { withAuth } from "@/utils/auth";

async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    try {
        const { db } = await DBInstance();

        // Fetch all users
        const users = await db
            .collection("users")
            .find({})
            .project({ password: 0 }) // Exclude password field
            .sort({ createdAt: -1 }) // Sort by creation date, newest first
            .toArray();

        // Add status field to each user
        const usersWithStatus = users.map(user => ({
            ...user,
            status: user.isApproved ? "approved" : "pending"
        }));

        return res.status(200).json({
            success: true,
            data: {
                users: usersWithStatus,
            },
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch users",
        });
    }
}

// Protect this route for admin users only
export default withAuth(handler); 