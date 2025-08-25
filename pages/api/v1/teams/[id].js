import DB from "@/utils/db";
import Team from "@/utils/models/team.model";

export default async function handler(req, res) {
    try {
        await DB.DBInstance();
    } catch (error) {
        console.error("Database connection error:", error);
        return res.status(500).json({ success: false, error: "Database connection failed" });
    }

    const { id } = req.query;
    const { method } = req;

    if (method === "GET") {
        try {
            const team = await Team.findById(id);
            if (!team) {
                return res.status(404).json({ success: false, error: "Team member not found" });
            }
            return res.status(200).json({ success: true, data: team });
        } catch (error) {
            console.error("Error fetching team member:", error);
            return res.status(500).json({ success: false, error: "Failed to fetch team member" });
        }
    } else if (method === "PUT") {
        try {
            // Validate required fields
            const { name, domain, position } = req.body;
            if (!name || !domain || !position) {
                return res.status(400).json({
                    success: false,
                    error: "Name, domain, and position are required fields"
                });
            }

            // Validate enum values
            const validDomains = ['President', 'Vice President', 'Technical', 'Corporate', 'Creatives'];
            const validPositions = ['President', 'Vice President', 'Director', 'Member', 'Lead', 'Associate', 'Admin', 'Alumni'];

            if (!validDomains.includes(domain)) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid domain. Must be one of: ${validDomains.join(', ')}`
                });
            }

            if (!validPositions.includes(position)) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid position. Must be one of: ${validPositions.join(', ')}`
                });
            }

            // Find the team member first
            const existingTeam = await Team.findById(id);
            if (!existingTeam) {
                return res.status(404).json({ success: false, error: "Team member not found" });
            }

            // Update the team member
            const team = await Team.findByIdAndUpdate(
                id,
                { ...req.body, updatedAt: new Date() },
                { new: true, runValidators: true }
            );

            return res.status(200).json({ success: true, data: team });
        } catch (error) {
            console.error("Error updating team member:", error);
            return res.status(500).json({
                success: false,
                error: error.message || "Failed to update team member"
            });
        }
    } else if (method === "DELETE") {
        try {
            const team = await Team.findByIdAndDelete(id);
            if (!team) {
                return res.status(404).json({ success: false, error: "Team member not found" });
            }
            return res.status(200).json({ success: true, data: team });
        } catch (error) {
            console.error("Error deleting team member:", error);
            return res.status(500).json({ success: false, error: "Failed to delete team member" });
        }
    } else {
        return res.status(405).json({ success: false, error: "Method Not Allowed" });
    }
} 