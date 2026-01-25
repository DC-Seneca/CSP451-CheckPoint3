const express = require("express");

const app = express();

// Root route (already tested in the starter project)
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Health endpoint (REQUIRED for CheckPoint 3)
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
  });
});

module.exports = app;
