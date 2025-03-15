Implementation Plan: Sword Duel
Overview
This plan guides you through building "Sword Duel," a 3D multiplayer sword-fighting game using three.js. You’ll create a web-based game with two-player duels, WASD movement, arrow key combat, an auto-follow camera, and a three-hit win condition. The plan is split into phases with tasks, estimated times, and dependencies to keep you on track.
Target Audience: Junior developer with basic JavaScript, HTML/CSS, and willingness to learn three.js and WebSockets.
Tools Needed:
Code Editor: VS Code or similar

Browser: Chrome/Firefox (with WebGL support)

Libraries: three.js (3D rendering), a WebSocket library (e.g., ws for Node.js or browser-native WebSockets)

Server: Node.js for multiplayer (optional: free hosting like Heroku or Glitch)

Total Estimated Time: ~40–60 hours (depending on learning curve)
Phase 1: Setup and Basic 3D Environment
Goal: Set up the project and create a simple 3D scene with a player model and arena.
Estimated Time: 8–10 hours
Task 1.1: Project Setup
What: Create a basic HTML file with three.js included.

How:
Create a folder: sword-duel.

Inside, add index.html:
html

<!DOCTYPE html>
<html>
<head>
    <title>Sword Duel</title>
    <style>body { margin: 0; overflow: hidden; }</style>
</head>
<body>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
    <script src="game.js"></script>
</body>
</html>

Add an empty game.js file.

Watch Out: Ensure the three.js CDN link works (update to the latest version if needed).

Task 1.2: Basic 3D Scene
What: Set up a scene, camera, renderer, and a flat arena.

How:
In game.js, initialize three.js:
javascript

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(100, 100);
const material = new THREE.MeshBasicMaterial({ color: 0x808080 });
const arena = new THREE.Mesh(geometry, material);
arena.rotation.x = -Math.PI / 2; // Lay flat
scene.add(arena);

camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);

function animate() {
requestAnimationFrame(animate);
renderer.render(scene, camera);
}
animate();

Watch Out: If the screen is black, check the console for errors (e.g., WebGL not supported).

Task 1.3: Add Player Model
What: Add a simple cube as a placeholder for the player.

How:
In game.js, after the arena:
javascript

const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = 1; // Above arena
scene.add(player);

Watch Out: Ensure the cube appears above the arena (adjust position.y if needed).

Milestone: You should see a gray arena with a blue cube in a 3D browser window.
Phase 2: Movement and Camera
Goal: Implement WASD movement and an auto-follow camera.
Estimated Time: 10–12 hours
Task 2.1: WASD Movement
What: Move the player with WASD keys.

How:
Add keyboard input tracking in game.js:
javascript

const keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

const speed = 0.1;
function updatePlayer() {
if (keys['w']) player.position.z -= speed;
if (keys['s']) player.position.z += speed;
if (keys['a']) player.position.x -= speed;
if (keys['d']) player.position.x += speed;
}

function animate() {
requestAnimationFrame(animate);
updatePlayer();
renderer.render(scene, camera);
}

Watch Out: Test all keys; if movement feels off, adjust speed.

Task 2.2: Add Second Player Placeholder
What: Add an opponent cube for the camera to follow.

How:
In game.js:
javascript

const opponentGeometry = new THREE.BoxGeometry(1, 2, 1);
const opponentMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const opponent = new THREE.Mesh(opponentGeometry, opponentMaterial);
opponent.position.set(5, 1, 5);
scene.add(opponent);

Watch Out: Ensure the opponent appears separate from the player.

Task 2.3: Auto-Follow Camera
What: Make the camera follow the opponent from behind the player.

How:
Update animate in game.js:
javascript

function updateCamera() {
const offset = new THREE.Vector3(0, 5, 10); // Behind and above player
const playerPos = player.position.clone();
const opponentPos = opponent.position.clone();
camera.position.copy(playerPos).add(offset);
camera.lookAt(opponentPos);
}

function animate() {
requestAnimationFrame(animate);
updatePlayer();
updateCamera();
renderer.render(scene, camera);
}

Watch Out: If the camera jerks, add smoothing (e.g., lerp) later.

Milestone: You can move the blue cube with WASD, and the camera follows the red cube.
Phase 3: Combat Mechanics
Goal: Add attacking and defending with arrow keys.
Estimated Time: 12–15 hours
Task 3.1: Attack Animations
What: Trigger simple attack animations with arrow keys.

How:
Add a sword (a thin box) to the player:
javascript

const swordGeometry = new THREE.BoxGeometry(0.2, 0.2, 2);
const swordMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
const sword = new THREE.Mesh(swordGeometry, swordMaterial);
sword.position.set(0.5, 1, -1); // Right hand
player.add(sword);

Track attacks in game.js:
javascript

let attackDir = null;
let attackTimer = 0;

window.addEventListener('keydown', (e) => {
if (!attackDir && !keys['Shift']) {
if (e.key === 'ArrowLeft') attackDir = 'left';
if (e.key === 'ArrowRight') attackDir = 'right';
if (e.key === 'ArrowUp') attackDir = 'up';
if (e.key === 'ArrowDown') attackDir = 'down';
if (attackDir) attackTimer = 0.5; // 0.5s attack
}
});

function updateAttacks() {
if (attackTimer > 0) {
attackTimer -= 0.016; // ~60 FPS
if (attackDir === 'left') sword.rotation.z = Math.PI / 4;
if (attackDir === 'right') sword.rotation.z = -Math.PI / 4;
if (attackDir === 'up') sword.rotation.x = -Math.PI / 4;
if (attackDir === 'down') sword.rotation.x = Math.PI / 4;
} else {
sword.rotation.set(0, 0, 0);
attackDir = null;
}
}

function animate() {
requestAnimationFrame(animate);
updatePlayer();
updateAttacks();
updateCamera();
renderer.render(scene, camera);
}

Watch Out: Test each direction; adjust rotation angles if the sword looks off.

Task 3.2: Block Mechanics
What: Add blocking with Shift + arrow keys.

How:
In game.js:
javascript

let blockDir = null;
let blockTimer = 0;

window.addEventListener('keydown', (e) => {
if (keys['Shift'] && !blockDir) {
if (e.key === 'ArrowLeft') blockDir = 'left';
if (e.key === 'ArrowRight') blockDir = 'right';
if (e.key === 'ArrowUp') blockDir = 'up';
if (e.key === 'ArrowDown') blockDir = 'down';
if (blockDir) blockTimer = 0.5;
}
});

function updateBlocks() {
if (blockTimer > 0) {
blockTimer -= 0.016;
// Visualize block with sword position
if (blockDir === 'left') sword.position.set(-0.5, 1, -1);
if (blockDir === 'right') sword.position.set(0.5, 1, -1);
if (blockDir === 'up') sword.position.set(0, 1.5, -1);
if (blockDir === 'down') sword.position.set(0, 0.5, -1);
} else {
sword.position.set(0.5, 1, -1);
blockDir = null;
}
}

function animate() {
requestAnimationFrame(animate);
updatePlayer();
updateAttacks();
updateBlocks();
updateCamera();
renderer.render(scene, camera);
}

Watch Out: Ensure Shift works with arrows; test timing overlap.

Task 3.3: Hit Detection
What: Detect hits and track score.

How:
In game.js:
javascript

let playerHits = 0;
let opponentHits = 0;

function checkHits() {
if (attackTimer > 0 && !blockDir) {
const distance = player.position.distanceTo(opponent.position);
if (distance < 3) { // Attack range
const attackMatchesBlock = attackDir === blockDir;
if (!attackMatchesBlock) opponentHits++;
console.log(`Opponent Hits: ${opponentHits}`);
if (opponentHits >= 3) alert('Player Wins!');
}
}
}

function animate() {
requestAnimationFrame(animate);
updatePlayer();
updateAttacks();
updateBlocks();
checkHits();
updateCamera();
renderer.render(scene, camera);
}

Watch Out: Test hit range (adjust 3 if too hard/easy).

Milestone: You can move, attack, block, and score hits locally.
Phase 4: Multiplayer
Goal: Make it a two-player game with WebSockets.
Estimated Time: 10–15 hours
Task 4.1: Setup Server
What: Create a basic Node.js server with WebSockets.

How:
Install Node.js and run npm init -y in sword-duel.

Install ws: npm install ws.

Create server.js:
javascript

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let players = [];

wss.on('connection', (ws) => {
players.push(ws);
ws.id = players.length;

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        players.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });

    ws.on('close', () => {
        players = players.filter((p) => p !== ws);
    });

});

console.log('Server running on port 8080');

Run: node server.js.

Watch Out: Ensure port 8080 is free.

Task 4.2: Client Networking
What: Sync player data over WebSockets.

How:
In game.js, connect to the server:
javascript

const socket = new WebSocket('ws://localhost:8080');
socket.onopen = () => console.log('Connected');

socket.onmessage = (event) => {
const data = JSON.parse(event.data);
opponent.position.set(data.x, data.y, data.z);
opponentHits = data.hits;
};

function sendPlayerData() {
if (socket.readyState === WebSocket.OPEN) {
socket.send(JSON.stringify({
x: player.position.x,
y: player.position.y,
z: player.position.z,
hits: playerHits
}));
}
}

function animate() {
requestAnimationFrame(animate);
updatePlayer();
updateAttacks();
updateBlocks();
checkHits();
sendPlayerData();
updateCamera();
renderer.render(scene, camera);
}

Watch Out: Test with two browser tabs; debug connection issues.

Milestone: Two players can connect, move, and fight in real-time.
Phase 5: Polish
Goal: Add visuals, audio, and game flow.
Estimated Time: 8–10 hours
Task 5.1: Better Models
What: Replace cubes with simple character/sword models.

How: Use three.js BoxGeometry with more segments or load a free .glb model with GLTFLoader.

Task 5.2: Audio
What: Add sound effects.

How: Use THREE.Audio with free sound files (e.g., from freesound.org).

Task 5.3: UI
What: Show hit counters and win screen.

How: Add HTML elements over the canvas and update via JavaScript.

Milestone: A polished game with visuals, sound, and a clear winner.
Tips for Success
Test Often: Run the game after each task to catch bugs early.

Google It: Look up three.js tutorials or WebSocket examples if stuck.

Start Small: Get one feature working before moving on.

This plan breaks "Sword Duel" into clear steps, from setup to multiplayer polish. Follow it task-by-task, and you’ll have a working game! If you hit a snag, let me know—I can dive deeper into any part. Happy coding!
