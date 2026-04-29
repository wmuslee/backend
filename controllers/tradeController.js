const User = require('../models/User');
const Stock = require('../models/Stock');
const Holding = require('../models/Holding');

const buyStock = async (req, res) => {
  try {
    const { ticker, shares } = req.body;
    const userId = req.user.id;

    if (!ticker || shares <= 0) {
      return res.status(400).json({ message: 'Invalid ticker or shares' });
    }

    const stock = await Stock.findOne({ ticker: ticker.toUpperCase() });
    if (!stock) return res.status(404).json({ message: 'Stock not found' });

    const totalCost = stock.currentPrice * shares;

    const user = await User.findById(userId);
    if (user.walletBalance < totalCost) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    user.walletBalance -= totalCost;
    await user.save();

    await Holding.findOneAndUpdate(
      { user: userId, ticker: stock.ticker },
      { $inc: { shares: shares } },
      { upsert: true, new: true }
    );

    res.json({
      message: `Successfully purchased ${shares} shares of ${ticker}`,
      newBalance: user.walletBalance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getHoldings = async (req, res) => {
  try {
    const userId = req.user.id;

    const holdings = await Holding.find({ user: userId });

    const holdingsWithPrice = await Promise.all(
      holdings.map(async (holding) => {
        const stock = await Stock.findOne({ ticker: holding.ticker });
        return {
          ticker: holding.ticker,
          shares: holding.shares,
          currentPrice: stock ? stock.currentPrice : 0
        };
      })
    );

    res.json(holdingsWithPrice);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { buyStock, getHoldings };