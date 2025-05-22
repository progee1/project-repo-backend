// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET || 'supersecretkey';

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// User schema & model
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Register Route
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(409).json({ message: 'Username already exists' });

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ username, passwordHash });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Middleware to verify JWT
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

// Fetch real-time BTC price from CoinMarketCap
async function fetchBtcPrice() {
  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest', {
      params: { symbol: 'BTC' },
      headers: { 'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY },
    });
    const price = response.data.data.BTC.quote.USD.price;
    return price;
  } catch (error) {
    console.error('Error fetching BTC price:', error.message);
    return null;
  }
}

// Protected route: Get BTC price
app.get('/api/bitcoin-price', authenticateToken, async (req, res) => {
  const price = await fetchBtcPrice();
  if (price === null) return res.status(503).json({ message: 'Unable to fetch BTC price' });
  res.json({ price });
});

// Protected route: Calculate BTC investment amount
app.post('/api/investment', authenticateToken, async (req, res) => {
  const { amountUsd } = req.body;
  if (typeof amountUsd !== 'number' || amountUsd <= 0) {
    return res.status(400).json({ message: 'Invalid amountUsd value' });
  }

  const price = await fetchBtcPrice();
  if (price === null) return res.status(503).json({ message: 'Unable to fetch BTC price' });

  const btcAmount = amountUsd / price;
  res.json({ btcAmount });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
