import express from "express";
import multer from "multer";
import csv from "csv-parser";
import validator from "validator";
import fs from "fs";
import path from "path";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

function isValidEmail(email) {
  return validator.isEmail(email);
}

// Expect CSV with a column named "email" (case-insensitive)
router.post("/parse", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "CSV required" });

  const results = [];
  const valid = [];
  const invalid = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => {
      const rawEmail = data.email || data.Email || data.EMAIL;
      if (!rawEmail) return;
      const email = rawEmail.trim();
      if (isValidEmail(email)) valid.push(email);
      else invalid.push(email);
    })
    .on("end", () => {
      // cleanup
      fs.unlink(req.file.path, () => {});
      res.json({ valid, invalid });
    })
    .on("error", (err) => {
      fs.unlink(req.file.path, () => {});
      res.status(500).json({ error: err.message });
    });
});

export default router;
