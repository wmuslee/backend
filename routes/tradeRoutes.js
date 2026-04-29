const express = require('express');
const { buyStock, getHoldings } = require('../controllers/tradeController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/buy', auth, buyStock);
router.get('/holdings', auth, getHoldings);

module.exports = router;