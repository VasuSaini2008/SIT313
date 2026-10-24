
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173"
  })
);

app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "DEV@Deakin Newsletter API is running."
  });
});

app.post("/api/newsletter", async (req, res) => {
  try {
    const { email } = req.body || {};

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        message: "Please enter your email address."
      });
    }

    const cleanEmail = email.trim();

    if (cleanEmail.length > 254) {
      return res.status(400).json({
        message: "The email address is too long."
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address."
      });
    }

    const requiredSettings = [
      "SMTP_HOST",
      "SMTP_USER",
      "SMTP_PASS",
      "NEWSLETTER_TO"
    ];

    const missingSettings = requiredSettings.filter(
      (setting) => !process.env[setting]
    );

    if (missingSettings.length > 0) {
      console.error(
        "Missing email settings:",
        missingSettings.join(", ")
      );

      return res.status(503).json({
        message: "The email service is not configured yet."
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.NEWSLETTER_TO,
      replyTo: cleanEmail,
      subject: "New DEV@Deakin Newsletter Subscription",
      text:
        "A new newsletter subscription request was received.\n\n" +
        "Subscriber email: " +
        cleanEmail
    });

    return res.status(200).json({
      message: "Thank you! Your subscription request was successful."
    });
  } catch (error) {
    console.error("Newsletter error:", error.message);

    return res.status(500).json({
      message: "Unable to process your request. Please try again."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Newsletter API running on http://localhost:${PORT}`);
});
