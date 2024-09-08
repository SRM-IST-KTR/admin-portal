import DBInstance from "@/utils/db";
import Event from "@/utils/models/event.models";
import mongoose from "mongoose";
import { generateQRCode } from "@/utils/email/qrcodeGenerator";
import { sendEmailWithAttachment } from "@/utils/email/emailSender";
import fs from "fs";
import path from "path";

DBInstance();

export default async function handler(req, res) {
  const { email, slug } = req.query;
  const { method } = req;

  if (method === "GET") {
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

      const existingParticipant = await Participant.findOne({ email });
      if (!existingParticipant) {
        return res
          .status(404)
          .json({ success: false, error: "Participant not found." });
      }

      if (existingParticipant.rsvp) {
        return res.status(200).send(`
          <html>
            <head>
              <title>RSVP Already Confirmed</title>
            </head>
            <body style="text-align:center; font-family:Arial, sans-serif;">
              <h1>RSVP Already Confirmed</h1>
              <p>You have already RSVPd for the event: <strong>${event.event_name}</strong>.</p>
              <p>If you need to make changes or have questions, please contact us at community@githubsrmist.tech.</p>
            </body>
          </html>
        `);
      }

      const updatedParticipant = await Participant.findOneAndUpdate(
        { email },
        { rsvp: true },
        { new: true }
      );

      const qrCodeData = JSON.stringify({
        slug: event.slug,
        email: updatedParticipant.email,
      });
      const qrCodeImage = await generateQRCode(qrCodeData);

      const emailTemplatePath = path.resolve("utils/email/ticket.html");
      const emailBodyTemplate = fs.readFileSync(emailTemplatePath, "utf-8");
      const emailBody = emailBodyTemplate
        .replaceAll("{{name}}", updatedParticipant.name)
        .replaceAll("{{email}}", updatedParticipant.email)
        .replaceAll("{{phn}}", updatedParticipant.phn)
        .replaceAll("{{event}}", event.event_name)
        .replaceAll("{{department}}", updatedParticipant.dept)
        .replaceAll("{{registrationNumber}}", updatedParticipant.regNo)
        .replaceAll("{{event_description}}", event.event_description)
        .replaceAll("{{date}}", event.event_date)
        .replaceAll("{{venue}}", event.venue)
        .replaceAll("{{prerequisites}}", event.prerequisites)
        .replaceAll("{{slug}}", event.slug);

      await sendEmailWithAttachment(
        email,
        `Event Ticket | ${event.event_name} | GitHub Community SRM`,
        emailBody,
        qrCodeImage,
        "event-ticket.png"
      );

      res.status(200).send(`
        <html>
          <head>
            <title>RSVP Confirmation</title>
          </head>
          <body style="text-align:center; font-family:Arial, sans-serif;">
            <h1>Thank you for RSVPing!</h1>
            <p>Your RSVP has been confirmed. Please check your email for the event ticket QR code.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Error updating participant:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
}
