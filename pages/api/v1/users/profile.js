import DBInstance from "@/utils/db";
import User from "@/utils/models/user.model";
import Team from "@/utils/models/team.model";
import { withAuth } from "@/utils/auth";

async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        await DBInstance();

        // Get user data from auth middleware
        const userId = req.user._id;
        const userEmail = req.user.email;

        // Fetch complete user data
        const userData = await User.findById(userId).select("-password");

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Fetch matching team member data
        const teamData = await Team.findOne({
            email: userEmail,
            isCurrent: true
        });

        // Return combined profile data
        return res.status(200).json({
            success: true,
            data: {
                user: userData,
                team: teamData || null
            }
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile data"
        });
    }
}

export default withAuth(handler); 