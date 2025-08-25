// import DBInstance from "../../../../utils/db";
import DB from "../../../../utils/db";
import User from "../../../../utils/models/user.model";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { currentPassword, newPassword, userId } = req.body;

        if (!currentPassword || !newPassword || !userId) {
            return res.status(400).json({ error: "Current password, new password, and user ID are required" });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Verify the current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }

        // Update the password
        user.password = newPassword;
        await user.save();

        // Create a login log for the password change
        await DB.DBInstance.collection("loginLogs").insertOne({
            userId: user._id,
            email: user.email,
            status: "success",
            action: "password_change",
            timestamp: new Date(),
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Change password error:", error);
        return res.status(500).json({ error: "An error occurred while changing the password" });
    }
} 