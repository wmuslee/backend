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

// === ИСПРАВЛЕННЫЙ CORS (как у подруги, но под твой Vercel) ===
app.use(cors({
  origin: [
    "https://pex-frontend-gold.vercel.app",   // твой фронтенд
    "https://*.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Для preflight-запросов
app.options("*", cors({
  origin: [
    "https://pex-frontend-gold.vercel.app",
    "https://*.vercel.app"
  ],
  credentials: true
}));

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

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}/ws`);
});