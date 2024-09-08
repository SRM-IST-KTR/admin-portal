import DBInstance from "@/utils/db";
import Event from "@/utils/models/event.models";
import mongoose from "mongoose";

DBInstance();

export default async function handleGetParticipants(req, res) {
  const { slug } = req.query;

  if (req.method === "GET") {
    try {
      const event = await Event.findOne({ slug });

      if (!event) {
        return res.status(404).json({ success: false, error: "Event not found" });
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
  } else {
    res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
}
