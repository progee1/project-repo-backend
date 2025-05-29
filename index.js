const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS: Allow requests from your frontend URL
app.use(cors({
  origin: "https://progee1.github.io"  // change if different frontend URL
}));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Dummy data store for demo purposes
let investments = [
  { id: 1, bitcoinAmount: 0.5, purchasePrice: 30000, date: "2023-01-01" },
  { id: 2, bitcoinAmount: 0.2, purchasePrice: 35000, date: "2023-02-15" }
];

// Routes

// GET /api/investments - return list of investments
app.get("/api/investments", (req, res) => {
  res.json(investments);
});

// POST /api/investments - add a new investment
app.post("/api/investments", (req, res) => {
  const { bitcoinAmount, purchasePrice, date } = req.body;
  if (!bitcoinAmount || !purchasePrice || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newInvestment = {
    id: investments.length + 1,
    bitcoinAmount,
    purchasePrice,
    date,
  };
  investments.push(newInvestment);
  res.status(201).json(newInvestment);
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "API is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
