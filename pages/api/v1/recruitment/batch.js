import ParticipantUser from "@/utils/models/recruitment.model";
import DB from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    await DB.DBRecruitment();

    const { ids, action, status } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: "Must provide non-empty array of candidate ids" });
    }

    if (action === "updateStatus") {
      if (!status) {
        return res.status(400).json({ success: false, error: "Must provide status to update" });
      }

      const result = await ParticipantUser.updateMany(
        { _id: { $in: ids } },
        { $set: { status } }
      );

      return res.status(200).json({
        success: true,
        message: `Updated status for ${result.modifiedCount} candidates`,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      });
    }

    if (action === "delete") {
      const result = await ParticipantUser.deleteMany({ _id: { $in: ids } });
      return res.status(200).json({
        success: true,
        message: `Deleted ${result.deletedCount} candidates`,
        deletedCount: result.deletedCount,
      });
    }

    return res.status(400).json({
      success: false,
      error: "Invalid action. Supported actions: 'updateStatus', 'delete'",
    });
  } catch (error) {
    console.error("Recruitment Batch API Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
}
