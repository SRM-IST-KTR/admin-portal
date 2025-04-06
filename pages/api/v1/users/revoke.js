import DBInstance from "@/utils/db";
import { withAuth } from "@/utils/auth";
import { ObjectId } from "mongodb";

async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "User ID is required",
            });
        }

        const { db } = await DBInstance();

        // Convert string ID to ObjectId
        const objectId = new ObjectId(userId);

        // Update user approval status
        const result = await db.collection("users").updateOne(
            { _id: objectId },
            {
                $set: {
                    isApproved: false,
                    revocationDate: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User access revoked successfully",
        });
    } catch (error) {
        console.error("Error revoking user access:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to revoke user access",
        });
    }
}

// Protect this route for admin users only
export default withAuth(handler, ["admin"]);