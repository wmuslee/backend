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


app.use(cors({
  origin: [
    "https://pex-frontend-gold.vercel.app",   // твой Vercel
    "http://localhost:5173",                 // локальный dev
    "http://localhost:3000"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/trade', tradeRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'PEX Backend is live 🚀' });
});

const server = http.createServer(app);
setupWebSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}/ws`);
});