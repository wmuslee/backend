const Stock = require('../models/Stock');
const { broadcastPriceUpdate } = require('../services/websocket');

const createStock = async (req, res) => {
  try {
    const { ticker, initialPrice = 50 } = req.body;
    const userId = req.user.id;

    const existingStock = await Stock.findOne({ owner: userId });
    if (existingStock) {
      return res.status(400).json({ message: 'You can create only one stock' });
    }

    const stock = await Stock.create({
      ticker: ticker.toUpperCase(),
      owner: userId,
      currentPrice: Number(initialPrice)
    });

    res.status(201).json({ message: 'Stock created successfully', stock });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'This ticker is already taken' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const updatePrice = async (req, res) => {
  try {
    const { price } = req.body;
    const { ticker } = req.params;
    const userId = req.user.id;

    const stock = await Stock.findOne({ ticker: ticker.toUpperCase() });

    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    if (stock.owner.toString() !== userId) {
      return res.status(403).json({ message: 'You can only change the price of your own stock' });
    }

    stock.currentPrice = Number(price);
    await stock.save();

    broadcastPriceUpdate(stock.ticker, stock.currentPrice);

    res.json({ message: 'Price updated successfully', stock });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find().populate('owner', 'username');
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createStock, updatePrice, getAllStocks };