/**
 * GameManager class for handling game state on the server
 */
class GameManager {
  constructor() {
    this.players = new Map(); // Map of player IDs to player data
    this.scores = new Map();  // Map of player IDs to scores
    this.maxScore = 3;        // Number of hits to win
  }
  
  /**
   * Add a new player to the game
   * @param {string} playerId - The socket ID of the player
   */
  addPlayer(playerId) {
    this.players.set(playerId, {
      id: playerId,
      position: { x: 0, y: 1, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      attackState: null,
      blockState: null
    });
    
    this.scores.set(playerId, 0);
    
    console.log(`Added player ${playerId}. Current player count: ${this.players.size}`);
    return this.getPlayerData();
  }
  
  /**
   * Remove a player from the game
   * @param {string} playerId - The socket ID of the player to remove
   */
  removePlayer(playerId) {
    this.players.delete(playerId);
    this.scores.delete(playerId);
    
    console.log(`Removed player ${playerId}. Current player count: ${this.players.size}`);
    return this.getPlayerData();
  }
  
  /**
   * Update a player's data
   * @param {Object} data - The updated player data
   */
  updatePlayer(data) {
    if (this.players.has(data.id)) {
      this.players.set(data.id, {
        id: data.id,
        position: data.position,
        rotation: data.rotation,
        attackState: data.attackState,
        blockState: data.blockState
      });
    }
  }
  
  /**
   * Handle a hit event
   * @param {Object} data - The hit data
   * @returns {Object} Updated score data
   */
  handleHit(data) {
    const { id, hitter } = data;
    
    // Increment score for the player who made the hit
    if (hitter === 'player') {
      const currentScore = this.scores.get(id) || 0;
      this.scores.set(id, currentScore + 1);
    } else if (hitter === 'opponent') {
      // In a real multiplayer scenario, we'd need to determine which 
      // player is the opponent, but for simplicity, we're incrementing
      // a generic "opponent" score here
      const opponentId = this.getOpponentId(id);
      if (opponentId) {
        const currentScore = this.scores.get(opponentId) || 0;
        this.scores.set(opponentId, currentScore + 1);
      }
    }
    
    console.log(`Updated scores after hit: ${JSON.stringify(Object.fromEntries(this.scores))}`);
    
    // Return the updated scores to broadcast to all players
    return this.getScoreData();
  }
  
  /**
   * Check if there's a winner (player who reached maxScore)
   * @returns {string|null} The ID of the winner, or null if no winner yet
   */
  checkForWinner() {
    for (const [playerId, score] of this.scores.entries()) {
      if (score >= this.maxScore) {
        return playerId;
      }
    }
    return null;
  }
  
  /**
   * Reset the game state for a new round
   */
  resetGame() {
    // Reset scores
    for (const playerId of this.scores.keys()) {
      this.scores.set(playerId, 0);
    }
    
    // Reset player states
    for (const playerId of this.players.keys()) {
      const player = this.players.get(playerId);
      player.attackState = null;
      player.blockState = null;
      this.players.set(playerId, player);
    }
    
    console.log('Game reset for new round');
  }
  
  /**
   * Get the opponent's ID for a given player
   * @param {string} playerId - The ID of the player
   * @returns {string|null} The ID of the opponent, or null if not found
   */
  getOpponentId(playerId) {
    for (const id of this.players.keys()) {
      if (id !== playerId) {
        return id;
      }
    }
    return null;
  }
  
  /**
   * Get all player data
   * @returns {Array} Array of player data objects
   */
  getPlayerData() {
    return Array.from(this.players.values());
  }
  
  /**
   * Get score data for all players
   * @returns {Object} Object with player IDs and scores
   */
  getScoreData() {
    return {
      scores: Object.fromEntries(this.scores)
    };
  }
}

module.exports = GameManager;
