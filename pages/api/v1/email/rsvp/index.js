// pages/api/send-rsvp.js
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const sesClient = new SESClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { participant, event } = req.body;
    try {
      const filePath = path.resolve(process.cwd(), "utils/email/rsvpMail.html");
      const emailContent = fs.readFileSync(filePath, "utf8");

      const customizedContent = emailContent
        .replaceAll("{{name}}", participant.name)
        .replaceAll("{{email}}", participant.email)
        .replaceAll("{{phn}}", participant.phn)
        .replaceAll("{{event}}", event.event_name)
        .replaceAll("{{department}}", participant.dept)
        .replaceAll("{{registrationNumber}}", participant.regNo)
        .replaceAll("{{event_description}}", event.event_description)
        .replaceAll("{{date}}", event.event_date)
        .replaceAll("{{venue}}", event.venue)
        .replaceAll("{{prerequisites}}", event.prerequisites)
        .replaceAll("{{slug}}", event.slug);

      const params = {
        Destination: {
          ToAddresses: [participant.email],
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: customizedContent,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: `RSVP Required for ${event.event_name}`,
          },
        },
        Source: `"GitHub Community SRM | Events" <events@githubsrmist.tech>`,
        ReplyToAddresses: ["community@githubsrmist.tech"],
      };

      const command = new SendEmailCommand(params);
      await sesClient.send(command);
      res.status(200).json({ message: "RSVP email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Error sending email" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
