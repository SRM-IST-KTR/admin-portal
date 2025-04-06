import DBInstance from "@/utils/db";
import Team from "@/utils/models/team.model";
import User from "@/utils/models/user.model";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        await DBInstance();

        // Get the name from query parameters
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name parameter is required"
            });
        }

        // First find the user to get details
        const user = await User.findOne({ name: name }).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Then find the team member with the same name
        const teamMember = await Team.findOne({
            name: name,
            isCurrent: true
        });

        // Return combined profile data
        return res.status(200).json({
            success: true,
            data: {
                user: user,
                team: teamMember || null
            }
        });
    } catch (error) {
        console.error("Error fetching profile by name:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile data"
        });
    }
} 