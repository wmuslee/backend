const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const stockRoutes = require('./routes/stockRoutes');
const tradeRoutes = require('./routes/tradeRoutes');
const { setupWebSocket } = require('./services/websocket');

dotenv.config();
connectDB();

const app = express();

// Максимально открытый CORS для Vercel
app.use(cors({
  origin: true,                    // разрешает ВСЕ источники (для продакшена)
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());   // ← это должно быть ДО роутов

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/trade', tradeRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'PEX Backend is live 🚀' });
});

const server = http.createServer(app);
setupWebSocket(server);

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});