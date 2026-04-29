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

// CORS (пока разрешаем всё для тестирования)
app.use(cors());

// Парсинг JSON
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/trade', tradeRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'PEX Backend is live 🚀' });
});

// Создаём HTTP сервер
const server = http.createServer(app);

// Настраиваем WebSocket
setupWebSocket(server);

// Запускаем сервер
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}/ws`);
});