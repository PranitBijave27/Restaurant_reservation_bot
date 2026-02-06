require("dotenv").config();

// Make fetch work reliably in all Node versions
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const { HfInference } = require("@huggingface/inference");
const hf = new HfInference(process.env.HF_API_KEY);

const express = require("express");
const mongoose = require("mongoose");
const Reservation = require("./models/reservation");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// ---------- TEMP MEMORY FOR NAME ----------
let pendingBooking = null;

// ---------- CONNECT MONGO ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

/**
 * ---------- HUGGING FACE AI EXTRACTOR ----------
 */
async function callAI(message) {
  try {
    const response = await hf.chatCompletion({
      model: "Qwen/Qwen2.5-7B-Instruct", // <-- NEW (works on free router)
      messages: [
        {
          role: "system",
          content: `
You are a restaurant booking extractor.

If the user wants to book, return ONLY JSON like:

{
  "name": "Guest",
  "date": "an actual real calendar date like 2026-02-08",
  "time": "24-hour time like 19:00",
  "people": number
}

If NOT a booking, return:
{"status":"not_booking"}
`,
        },

        { role: "user", content: message },
      ],
      max_tokens: 200,
    });

    console.log("HF RAW OUTPUT:", response);

    const text = response.choices?.[0]?.message?.content || "";

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return JSON.stringify({ status: "not_booking" });
    }

    return match[0];
  } catch (err) {
    console.error("HF SDK Error:", err);
    return JSON.stringify({ status: "not_booking" });
  }
}

/**
 * ---------- CHAT ENDPOINT ----------
 */
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ reply: "Please enter a message." });
    }

    // ----- CASE 1: waiting for name -----
    if (pendingBooking) {
      pendingBooking.name = message;

      const booking = await Reservation.create(pendingBooking);
      pendingBooking = null;

      return res.json({
        reply: `✅ Confirmed! Table for ${booking.people} on ${booking.date} at ${booking.time} under the name **${booking.name}**.`,
        booking,
      });
    }

    // ----- CASE 2: new message -----
    const aiText = await callAI(message);
    const details = JSON.parse(aiText);

    if (details.status === "not_booking") {
      return res.json({
        reply:
          "I can help you with reservations! Try: 'Book for 4 people tonight at 7pm'.",
      });
    }

    // Store temporarily and ask for name
    // ---- If booking detected, first check missing info ----
pendingBooking = details;   // store booking temporarily

// Ask for missing date
if (!details.date || details.date === "YYYY-MM-DD") {
  return res.json({
    reply: "Sure — for which date would you like the reservation? 📅"
  });
}

// Ask for missing time
if (!details.time) {
  return res.json({
    reply: "Got it — what time should I book the table? ⏰"
  });
}

// Ask for missing people
if (!details.people) {
  return res.json({
    reply: "How many people will be dining? 🍽️"
  });
}

// If everything is present, NOW ask for name
return res.json({
  reply: "Great — may I have your name for the reservation? 🙂"
});

  } catch (err) {
    console.error("Server Error:", err);
    res
      .status(500)
      .json({
        reply: "I'm having trouble processing that right now. Try again?",
      });
  }
});

/**
 * ---------- ADMIN ROUTE ----------
 */
app.get("/admin", async (req, res) => {
  try {
    const allReservations = await Reservation.find().sort({ date: -1 });
    res.json(allReservations);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch reservations" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
