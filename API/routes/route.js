import express from "express";
import checkJwt from "../middleware/auth.js";
import multer from "multer";
import sgMail from "@sendgrid/mail";
import fs from "fs";
import { config } from "dotenv";
config()


const router = express.Router();
const upload = multer({ dest: "uploads/" });
console.log(process.env.SENDGRID_API_KEY)

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Define protected route
router.get("/api/protected", checkJwt, (req, res) => {
  console.log("Protected route accessed");
  res.status(200).json({
    message: "welcome",
  });
});

// Route to send email with CSV attachment
router.post("/api/send-email", upload.single("file"), async (req, res) => {
  try {
    const { to, subject, text } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }

    // Read the CSV file
    const csvData = fs.readFileSync(file.path);

    // Create SendGrid message
    const msg = {
      to: to,
      from: "badri.siva1999@gmail.com", // Replace with your verified sender email
      subject: subject,
      text: text,
      attachments: [
        {
          content: csvData.toString("base64"),
          filename: file.originalname,
          type: file.mimetype,
          disposition: "attachment",
        },
      ],
    };

    // Send the email
    await sgMail.send(msg);

    // Remove the uploaded file after sending the email
    fs.unlinkSync(file.path);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.log(error.response.body)
    console.error("Error sending email: ", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

export default router;
