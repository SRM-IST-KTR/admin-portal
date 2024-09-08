import DBInstance from "@/utils/db";
import Event from "@/utils/models/event.models";
import mongoose from "mongoose";

DBInstance();

export default async function handler(req, res) {
  const { id } = req.query;
  const { method } = req;

  if (method === "GET") {
    try {
      const event = await Event.findOne({ slug: id });

      if (!event) {
        return res
          .status(404)
          .json({ success: false, error: "Event not found" });
      }

      const { database, collection } = event;
      const db = mongoose.connection.useDb(database);
      const participantsCollection = collection.participants;

      const Participant = db.model(
        participantsCollection,
        new mongoose.Schema({})
      );
      const participants = await Participant.find();

      res.status(200).json({ success: true, data: participants });
    } catch (error) {
      console.error("Error fetching participants:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else if (method === "PUT") {
    try {
      const event = await Event.findOne({
        "collection.participants": { $exists: true },
      });
      if (!event) {
        return res
          .status(404)
          .json({ success: false, error: "Event not found." });
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
        { email: id },
        req.body,
        { new: true }
      );

      if (!updatedParticipant) {
        return res
          .status(404)
          .json({ success: false, error: "Participant not found." });
      }

      res.status(200).json({
        success: true,
        data: updatedParticipant,
      });
    } catch (error) {
      console.error("Error updating participant:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
}
