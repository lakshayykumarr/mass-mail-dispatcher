import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import uploadRoute from "./routes/upload.js";
import { sendBulkEmail } from "./emailSender.js";

dotenv.config();
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/upload", uploadRoute);

// Send endpoint
app.post("/api/send", async (req, res) => {
  const { subject, message, recipients } = req.body;
  if (!subject || !message || !Array.isArray(recipients))
    return res
      .status(400)
      .json({ error: "subject, message, recipients required" });

  const result = await sendBulkEmail({
    subject,
    text: message,
    recipients,
  });
  res.json({ result });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
