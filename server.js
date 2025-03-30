require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Add Debugging Logs
console.log("Connecting to MongoDB...");
console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define Schema & Model
const visitSchema = new mongoose.Schema({
  userId: String,
  site: String,
  timestamp: Date,
});

const Visit = mongoose.model("Visit", visitSchema);

// ✅ API to Store Tracking Data
app.post("/api/track", async (req, res) => {
  console.log("Incoming POST request:", req.body);
  const { userId, site, timestamp } = req.body;

  if (!userId || !site) {
    return res.status(400).json({ error: "Missing userId or site" });
  }

  await Visit.create({ userId, site, timestamp });

  res.json({ message: "Tracking data stored successfully!" });
});

// ✅ API to Retrieve User Analytics
app.get("/api/analytics/:userId", async (req, res) => {
  const { userId } = req.params;

  const data = await Visit.find({ userId }).sort({ timestamp: -1 });

  res.json(data);
});

// ✅ Root Route for Health Check
app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
