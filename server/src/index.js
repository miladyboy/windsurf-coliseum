const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const GameManager = require('./game-manager');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Initialize game manager
const gameManager = new GameManager();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);
  
  // Add player to game manager
  gameManager.addPlayer(socket.id);
  
  // Handle player updates
  socket.on('playerUpdate', (data) => {
    gameManager.updatePlayer(data);
    
    // Broadcast to other players
    socket.broadcast.emit('opponentUpdate', data);
  });
  
  // Handle hit events
  socket.on('hit', (data) => {
    // Update scores in game manager
    const scoreData = gameManager.handleHit(data);
    
    // Broadcast updated scores to all players
    io.emit('scoreUpdate', scoreData);
    
    // Check for game over
    const winner = gameManager.checkForWinner();
    if (winner) {
      io.emit('gameOver', { winner });
      
      // Reset game for the next round
      gameManager.resetGame();
    }
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    gameManager.removePlayer(socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Serve static files from public directory for testing
app.use(express.static('public'));

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Server is running');
});
