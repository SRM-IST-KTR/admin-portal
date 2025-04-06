import DBInstance from "@/utils/db";
import { withAuth } from "@/utils/auth";

async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    try {
        const { db } = await DBInstance();

        // Fetch approved users
        const users = await db
            .collection("users")
            .find({ isApproved: true })
            .project({ password: 0 }) // Exclude password field
            .sort({ approvalDate: -1 }) // Sort by approval date, newest first
            .toArray();

        return res.status(200).json({
            success: true,
            data: {
                users,
            },
        });
    } catch (error) {
        console.error("Error fetching approved users:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch approved users",
        });
    }
}

// Protect this route for admin users only
export default withAuth(handler, ["admin"]); 