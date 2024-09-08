import dbInstance from "@/utils/db";
import Event from "@/utils/models/event.models";
import mongoose from "mongoose";

dbInstance();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { slug, email } = req.body;

    try {
      const event = await Event.findOne({ slug });

      if (!event) {
        return res
          .status(404)
          .json({ success: false, error: "Event not found" });
      }

      const { database, collection } = event;
      const db = mongoose.connection.useDb(database);
      const participantSchema = new mongoose.Schema({
        name: { type: String, required: true },
        regNo: { type: String, required: true },
        email: { type: String, required: true },
        phn: { type: String, required: true },
        dept: { type: String, required: true },
        rsvp: { type: Boolean, default: false },
        checkin: { type: Boolean, default: false },
        snacks: { type: Boolean, default: false },
      });

      const Participant = db.model(collection.participants, participantSchema);
      const participant = await Participant.findOneAndUpdate(
        { email },
        { checkin: true },
        { new: true }
      );

      if (!participant) {
        return res
          .status(404)
          .json({ success: false, error: "Participant not found" });
      }

      res.status(200).json({ success: true, data: participant });
    } catch (error) {
      console.error("Error updating check-in status:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
}
