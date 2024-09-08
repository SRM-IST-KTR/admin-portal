import DBInstance from "@/utils/db";
import Event from "@/utils/models/event.models";
import mongoose from "mongoose";

DBInstance();

export default async function handleUpdateParticipant(req, res) {
  const { email } = req.query;
  const { rsvp, checkin, snacks } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: "Email is required." });
  }

  if (req.method === "PUT") {
    try {
      const event = await Event.findOne({ "collection.participants": { $exists: true } });
      if (!event) {
        return res.status(404).json({ success: false, error: "Event not found." });
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

      const updatedParticipant = await Participant.findOneAndUpdate(
        { email },
        { rsvp, checkin, snacks },
        { new: true }
      );

      if (!updatedParticipant) {
        return res.status(404).json({ success: false, error: "Participant not found." });
      }

      res.status(200).json({
        success: true,
        data: updatedParticipant,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
}
