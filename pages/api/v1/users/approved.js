import dbInstance from "@/utils/db";
import User from "@/utils/models/user.model";
import { getSession } from "@/utils/auth";

dbInstance();

export default async function handler(req, res) {
  const { method } = req;
  const session = await getSession(req, res);

  if (!session) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
  }

  try {
    // Fetch all approved users
    const users = await User.find({ status: "approved" })
      .select("name email position domain role")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error("Error fetching approved users:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch users" });
  }
}