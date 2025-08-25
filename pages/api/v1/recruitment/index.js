import ParticipantUser from "@/utils/models/recruitment.model";
import DB from "@/utils/db";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            // Connect to MongoDB using the default instance
            await DB.DBRecruitment();

            // Retrieve all recruitment data from the database
            const recruitment_data = await ParticipantUser.find();

            // Send the response with the retrieved events
            res.status(200).json({ success: true, data: recruitment_data });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: "Internal Server Error" });
        }
    } else {
        // Handle unsupported HTTP methods
        res.status(405).json({ success: false, error: "Method Not Allowed" });
    }
}
