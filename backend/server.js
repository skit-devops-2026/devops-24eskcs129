require("dotenv").config();
const authRoutes = require("./routes/auth");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const noteRoutes = require("./routes/notes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.get("/", (req, res) => {
  res.send("NoteME backend is running!");
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "NoteME backend is healthy"
  });
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from the .env file");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`NoteME backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start NoteME backend:", error.message);
    process.exit(1);
  }
}

startServer();
