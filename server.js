// File: server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Dummy user
const user = {
  username: 'admin',
  password: 'password' // You can hash this in production
};

// Auth Route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === user.username && password === user.password) {
    const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

// Middleware to verify JWT
debugger;
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Protected route example
app.get('/api/bitcoin-price', authenticateToken, (req, res) => {
  const fakeBitcoinPrice = 65784.23; // In production, fetch from a real API
  res.json({ price: fakeBitcoinPrice });
});

app.post('/api/investment', authenticateToken, (req, res) => {
  const { amountUsd } = req.body;
  const btcPrice = 65784.23; // Fake fixed value again for example
  const btcAmount = amountUsd / btcPrice;
  res.json({ btcAmount });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
