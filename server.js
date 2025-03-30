require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Schema & Model
const visitSchema = new mongoose.Schema({
  userId: String,
  site: String,
  timestamp: Date,
});

const Visit = mongoose.model("Visit", visitSchema);

// 📌 API to Store Tracking Data
app.post("/api/track", async (req, res) => {
  const { userId, site, timestamp } = req.body;

  if (!userId || !site) {
    return res.status(400).json({ error: "Missing userId or site" });
  }

  await Visit.create({ userId, site, timestamp });

  res.json({ message: "Tracking data stored successfully!" });
});

// 📌 API to Retrieve User Analytics
app.get("/api/analytics/:userId", async (req, res) => {
  const { userId } = req.params;

  const data = await Visit.find({ userId }).sort({ timestamp: -1 });

  res.json(data);
});

app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
