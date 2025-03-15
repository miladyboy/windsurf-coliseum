import io from 'socket.io-client';

export class NetworkManager {
  constructor() {
    this.socket = null;
    this.serverUrl = 'http://localhost:3001'; // URL of our game server
    this.connected = false;
    this.playerId = null;
    
    // Callback functions
    this.opponentUpdateCallback = null;
    this.scoreUpdateCallback = null;
    this.gameOverCallback = null;
  }
  
  connect() {
    try {
      this.socket = io(this.serverUrl);
      
      // Connection event
      this.socket.on('connect', () => {
        this.connected = true;
        this.playerId = this.socket.id;
        console.log('Connected to server with id:', this.playerId);
      });
      
      // Disconnection event
      this.socket.on('disconnect', () => {
        this.connected = false;
        console.log('Disconnected from server');
      });
      
      // Server error event
      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
      
      // Game-specific events
      this.setupGameEvents();
      
    } catch (error) {
      console.error('Failed to connect to server:', error);
    }
  }
  
  setupGameEvents() {
    // Receive opponent data
    this.socket.on('opponentUpdate', (data) => {
      if (this.opponentUpdateCallback) {
        this.opponentUpdateCallback(data);
      }
    });
    
    // Receive score updates
    this.socket.on('scoreUpdate', (data) => {
      if (this.scoreUpdateCallback) {
        this.scoreUpdateCallback(data);
      }
    });
    
    // Receive game over event
    this.socket.on('gameOver', (data) => {
      if (this.gameOverCallback) {
        this.gameOverCallback(data);
      }
    });
  }
  
  // Send player data to server
  sendPlayerData(playerData) {
    if (this.connected) {
      this.socket.emit('playerUpdate', {
        id: this.playerId,
        position: {
          x: playerData.position.x,
          y: playerData.position.y,
          z: playerData.position.z
        },
        rotation: {
          x: playerData.rotation.x,
          y: playerData.rotation.y,
          z: playerData.rotation.z
        },
        attackState: playerData.attackState,
        blockState: playerData.blockState
      });
    }
  }
  
  // Send hit information to server
  sendHit(hitter) {
    if (this.connected) {
      this.socket.emit('hit', {
        id: this.playerId,
        hitter: hitter
      });
    }
  }
  
  // Register callback for opponent updates
  onOpponentUpdate(callback) {
    this.opponentUpdateCallback = callback;
  }
  
  // Register callback for score updates
  onScoreUpdate(callback) {
    this.scoreUpdateCallback = callback;
  }
  
  // Register callback for game over event
  onGameOver(callback) {
    this.gameOverCallback = callback;
  }
  
  // Disconnect from server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
