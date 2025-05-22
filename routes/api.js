// routes/api.js
const express = require('express');
const router = express.Router();
const { getData, postData } = require('../controllers/dataController');
const authenticate = require('../middleware/auth');

router.get('/data', authenticate, getData);
router.post('/data', authenticate, postData);

module.exports = router;
