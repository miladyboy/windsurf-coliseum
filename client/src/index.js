// Main entry point for the Sword Duel game
import { Game } from './game.js';
import { UIManager } from './ui-manager.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI Manager
  const uiManager = new UIManager();
  
  // Initialize game when start button is clicked
  document.getElementById('start-button').addEventListener('click', () => {
    uiManager.showGame();
    
    // Initialize the game
    const game = new Game(uiManager);
    game.init();
  });
  
  // Restart game when restart button is clicked
  document.getElementById('restart-button').addEventListener('click', () => {
    window.location.reload(); // Simple restart for now
  });
});
