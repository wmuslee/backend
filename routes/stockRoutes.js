const express = require('express');
const { 
  createStock, 
  updatePrice, 
  getAllStocks 
} = require('../controllers/stockController');

const auth = require('../middleware/auth');

const router = express.Router();

router.post('/create', auth, createStock);
router.get('/', auth, getAllStocks);
router.put('/:ticker/price', auth, updatePrice);

module.exports = router;