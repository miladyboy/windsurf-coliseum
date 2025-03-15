import * as THREE from 'three';
import { Player } from './player.js';
import { Opponent } from './opponent.js';
import { Arena } from './arena.js';
import { CameraController } from './camera-controller.js';
import { NetworkManager } from './network-manager.js';

export class Game {
  constructor(uiManager) {
    this.uiManager = uiManager;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.player = null;
    this.opponent = null;
    this.arena = null;
    this.cameraController = null;
    this.networkManager = null;
    this.keysPressed = {};
    this.clock = new THREE.Clock();
    this.playerScore = 0;
    this.opponentScore = 0;
    this.gameActive = false;
  }
  
  init() {
    // Initialize Three.js scene, camera, and renderer
    this.initThree();
    
    // Initialize arena
    this.initArena();
    
    // Initialize player and opponent
    this.initPlayers();
    
    // Initialize camera controller
    this.initCameraController();
    
    // Initialize network manager
    this.initNetworkManager();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Start the game
    this.start();
  }
  
  initThree() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB); // Sky blue background
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('game-canvas'),
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);
  }
  
  initArena() {
    this.arena = new Arena();
    this.scene.add(this.arena.mesh);
  }
  
  initPlayers() {
    // Initialize local player
    this.player = new Player();
    this.scene.add(this.player.mesh);
    
    // Initialize opponent
    this.opponent = new Opponent();
    this.scene.add(this.opponent.mesh);
    
    // Position players opposite each other
    this.player.mesh.position.set(-5, 1, 0);
    this.opponent.mesh.position.set(5, 1, 0);
  }
  
  initCameraController() {
    this.cameraController = new CameraController(
      this.camera,
      this.player.mesh,
      this.opponent.mesh,
      this.player
    );
  }
  
  initNetworkManager() {
    this.networkManager = new NetworkManager();
    this.networkManager.connect();
    
    // Set up network event handlers
    this.networkManager.onOpponentUpdate((data) => {
      this.updateOpponent(data);
    });
    
    this.networkManager.onScoreUpdate((data) => {
      this.updateScore(data);
    });
    
    this.networkManager.onGameOver((data) => {
      this.gameOver(data);
    });
  }
  
  setupEventListeners() {
    // Keyboard events for player controls
    window.addEventListener('keydown', (e) => {
      // Store standardized key names
      const key = e.key.toLowerCase();
      // For arrow keys, convert from 'ArrowLeft' to 'left', etc.
      if (key.startsWith('arrow')) {
        this.keysPressed[key.replace('arrow', '')] = true;
      } else {
        this.keysPressed[key] = true;
      }
    });
    
    window.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      if (key.startsWith('arrow')) {
        this.keysPressed[key.replace('arrow', '')] = false;
      } else {
        this.keysPressed[key] = false;
      }
    });
    
    // Window resize event
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
  
  start() {
    this.gameActive = true;
    this.uiManager.showScoreDisplay();
    this.animate();
  }
  
  animate() {
    if (!this.gameActive) return;
    
    requestAnimationFrame(this.animate.bind(this));
    
    const delta = this.clock.getDelta();
    
    // Update player based on input
    this.updatePlayer(delta);
    
    // Update camera
    this.cameraController.update(delta);
    
    // Check for hits
    this.checkHits();
    
    // Send player data to server
    this.networkManager.sendPlayerData({
      position: this.player.mesh.position,
      rotation: this.player.mesh.rotation,
      attackState: this.player.attackState,
      blockState: this.player.blockState
    });
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
  
  updatePlayer(delta) {
    // Handle movement
    if (this.keysPressed['w']) {
      this.player.moveForward(delta);
    }
    if (this.keysPressed['s']) {
      this.player.moveBackward(delta);
    }
    if (this.keysPressed['a']) {
      this.player.moveLeft(delta);
    }
    if (this.keysPressed['d']) {
      this.player.moveRight(delta);
    }
    
    // Handle attacks
    if (this.keysPressed['left']) {
      this.player.attack('left');
    } else if (this.keysPressed['right']) {
      this.player.attack('right');
    } else if (this.keysPressed['up']) {
      this.player.attack('up');
    } else if (this.keysPressed['down']) {
      this.player.attack('down');
    }
    
    // Handle blocks
    if (this.keysPressed['shift']) {
      if (this.keysPressed['left']) {
        this.player.block('left');
      } else if (this.keysPressed['right']) {
        this.player.block('right');
      } else if (this.keysPressed['up']) {
        this.player.block('up');
      } else if (this.keysPressed['down']) {
        this.player.block('down');
      }
    }
    
    // Update player state
    this.player.update(delta);
  }
  
  updateOpponent(data) {
    // Update opponent position, rotation, and states based on network data
    this.opponent.mesh.position.copy(data.position);
    this.opponent.mesh.rotation.copy(data.rotation);
    this.opponent.attackState = data.attackState;
    this.opponent.blockState = data.blockState;
  }
  
  checkHits() {
    // Basic hit detection
    const distance = this.player.mesh.position.distanceTo(this.opponent.mesh.position);
    
    // If players are within attack range and one is attacking
    if (distance < 2) {
      if (this.player.isAttacking() && !this.opponent.isBlockingCorrectly(this.player.attackState)) {
        // Player hit opponent
        this.networkManager.sendHit('player');
        this.playerScore++;
        this.uiManager.updateScore(this.playerScore, this.opponentScore);
        
        // Check for win
        if (this.playerScore >= 3) {
          this.gameOver({ winner: 'player' });
        }
      }
      
      if (this.opponent.isAttacking() && !this.player.isBlockingCorrectly(this.opponent.attackState)) {
        // Opponent hit player
        this.networkManager.sendHit('opponent');
        this.opponentScore++;
        this.uiManager.updateScore(this.playerScore, this.opponentScore);
        
        // Check for win
        if (this.opponentScore >= 3) {
          this.gameOver({ winner: 'opponent' });
        }
      }
    }
  }
  
  updateScore(data) {
    this.playerScore = data.playerScore;
    this.opponentScore = data.opponentScore;
    this.uiManager.updateScore(this.playerScore, this.opponentScore);
  }
  
  gameOver(data) {
    this.gameActive = false;
    this.uiManager.showGameOver(data.winner);
  }
}
