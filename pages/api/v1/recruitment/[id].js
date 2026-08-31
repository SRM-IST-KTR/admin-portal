import ParticipantUser from "@/utils/models/recruitment.model";
import DB from "@/utils/db";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: "Missing candidate id" });
  }

  try {
    await DB.DBRecruitment();

    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const query = isMongoId
      ? { _id: id }
      : {
          $or: [
            { email: id.toLowerCase().trim() },
            { registrationNumber: id.trim() },
          ],
        };

    switch (req.method) {
      case "GET": {
        const candidate = await ParticipantUser.findOne(query);
        if (!candidate) {
          return res.status(404).json({ success: false, error: "Candidate not found" });
        }
        return res.status(200).json({ success: true, data: candidate });
      }

      case "PUT":
      case "PATCH": {
        const updateData = req.body;
        const candidate = await ParticipantUser.findOneAndUpdate(query, updateData, {
          new: true,
          runValidators: true,
        });

        if (!candidate) {
          return res.status(404).json({ success: false, error: "Candidate not found to update" });
        }

        return res.status(200).json({
          success: true,
          message: "Candidate updated successfully",
          data: candidate,
        });
      }

      case "DELETE": {
        const deleted = await ParticipantUser.findOneAndDelete(query);
        if (!deleted) {
          return res.status(404).json({ success: false, error: "Candidate not found to delete" });
        }

        return res.status(200).json({
          success: true,
          message: "Candidate deleted successfully",
          data: deleted,
        });
      }

      default:
        res.setHeader("Allow", ["GET", "PUT", "PATCH", "DELETE"]);
        return res.status(405).json({
          success: false,
          error: `Method ${req.method} Not Allowed`,
        });
    }
  } catch (error) {
    console.error("Recruitment [id] API Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
}
