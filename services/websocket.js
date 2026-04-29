const { WebSocketServer } = require('ws');
const jwt = require('jsonwebtoken');

const clients = new Map();

const setupWebSocket = (server) => {
  const wss = new WebSocketServer({ 
    server, 
    path: '/ws' 
  });

  wss.on('connection', (ws, req) => {
  const protocol = req.headers['sec-websocket-protocol'];

  if (!protocol) {
    ws.close(1008, 'Missing token');
    return;
  }

  try {
    const decoded = jwt.verify(protocol, process.env.JWT_SECRET);
    ws.userId = decoded.id;
    ws.username = decoded.username;

    clients.set(decoded.id, ws);

    console.log(`WebSocket connected: ${decoded.username}`);

    ws.send(JSON.stringify({
      type: "CONNECTION_SUCCESS",
      payload: { message: "Connected to PEX Live Market" }
    }));

  } catch (err) {
    ws.close(1008, 'Invalid token');
  }

  ws.on('close', () => {
    if (ws.userId) clients.delete(ws.userId);
  });
});
};

const broadcastPriceUpdate = (ticker, price) => {
  const message = JSON.stringify({
    type: "TICKER_UPDATE",
    payload: { ticker, price }
  });

  clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
};

module.exports = { setupWebSocket, broadcastPriceUpdate };