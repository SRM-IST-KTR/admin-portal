import DBInstance from "@/utils/db";
import Team from "@/utils/models/team.model";

export default async function handler(req, res) {
    try {
        await DBInstance();
    } catch (error) {
        console.error("Database connection error:", error);
        return res.status(500).json({ success: false, error: "Database connection failed" });
    }

    const { method } = req;

    if (method === "GET") {
        try {
            const teams = await Team.find().sort({ index: 1 });
            return res.status(200).json({ success: true, data: teams });
        } catch (error) {
            console.error("Error fetching teams:", error);
            return res.status(500).json({ success: false, error: "Failed to fetch teams" });
        }
    } else if (method === "POST") {
        try {
            const team = await Team.create(req.body);
            return res.status(201).json({ success: true, data: team });
        } catch (error) {
            console.error("Error creating team member:", error);
            return res.status(500).json({
                success: false,
                error: error.message || "Failed to create team member"
            });
        }
    } else {
        return res.status(405).json({ success: false, error: "Method Not Allowed" });
    }
} 