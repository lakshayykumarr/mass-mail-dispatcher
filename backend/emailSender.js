import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendBulkEmail({ subject, text, recipients }) {
  const results = [];
  for (const to of recipients) {
    try {
      await transporter.sendMail({
        from: `"${process.env.FROM_NAME}" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
      });
      results.push({ to, status: "sent" });
    } catch (err) {
      results.push({ to, status: "error", error: err.message });
    }
  }
  return results;
}
