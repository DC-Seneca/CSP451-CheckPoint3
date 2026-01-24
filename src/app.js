const express = require("express");

const app = express();

// Default route (Part A requirement)
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Hello from CSP451" });
});

// Health route (Part B requirement)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", uptime: process.uptime() });
});

module.exports = app;

// Allow running locally: `npm start`
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Listening on ${port}`);
  });
}
