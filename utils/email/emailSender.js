import AWS from "aws-sdk";
import { createTransport } from "nodemailer";
import nodemailerSES from "nodemailer-ses-transport";

const ses = new AWS.SES({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const sesTransport = createTransport(
  nodemailerSES({
    ses,
  })
);

export async function sendEmailWithAttachment(
  toAddress,
  subject,
  body,
  attachmentBuffer,
  attachmentName
) {
  const mailOptions = {
    from: "GitHub Community SRM | Events <events@githubsrmist.tech>",
    replyTo: "community@githubsrmist.tech",
    to: toAddress,
    subject,
    html: body,
    attachments: [
      {
        filename: attachmentName,
        content: attachmentBuffer,
        encoding: "base64",
      },
    ],
  };

  try {
    await sesTransport.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
}
