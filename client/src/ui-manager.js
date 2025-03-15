export class UIManager {
  constructor() {
    this.mainMenu = document.getElementById('main-menu');
    this.scoreDisplay = document.getElementById('score-display');
    this.playerScoreElement = document.getElementById('player-score');
    this.opponentScoreElement = document.getElementById('opponent-score');
    this.gameOverDisplay = document.getElementById('game-over');
    this.winnerDisplay = document.getElementById('winner-display');
  }
  
  showGame() {
    this.mainMenu.style.display = 'none';
  }
  
  showScoreDisplay() {
    this.scoreDisplay.style.display = 'block';
  }
  
  updateScore(playerScore, opponentScore) {
    this.playerScoreElement.textContent = playerScore;
    this.opponentScoreElement.textContent = opponentScore;
  }
  
  showGameOver(winner) {
    const winnerText = winner === 'player' ? 'You Win!' : 'Opponent Wins!';
    this.winnerDisplay.textContent = winnerText;
    this.gameOverDisplay.style.display = 'block';
  }
}
