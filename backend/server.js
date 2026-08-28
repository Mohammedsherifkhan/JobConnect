require("dotenv").config();

const express = require("express");
const pool = require("./config/db");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "JobConnect Backend API is running"
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      message: "PostgreSQL connected",
      time: result.rows[0].now
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Database connection failed"
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`JobConnect backend running on port ${PORT}`);
});