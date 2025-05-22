// index.js
const express = require('express');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mount API routes
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
