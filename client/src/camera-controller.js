import * as THREE from 'three';

export class CameraController {
  constructor(camera, playerMesh, opponentMesh, player) {
    this.camera = camera;
    this.playerMesh = playerMesh;
    this.opponentMesh = opponentMesh;
    this.player = player; // Store reference to player object
    
    // Camera settings
    this.eyeHeight = 1.7;      // Eye level for a human
    this.forwardOffset = 0.2;  // Slight forward offset to see weapon
    this.dampingFactor = 0.1;  // Smoothing factor for camera movement
    
    // Initial position
    this.updateCameraPosition();
  }
  
  update(delta) {
    this.updateCameraPosition();
  }
  
  updateCameraPosition() {
    // Calculate the position for first-person camera (at player's eye level)
    const targetPosition = new THREE.Vector3(
      this.playerMesh.position.x,
      this.playerMesh.position.y + this.eyeHeight,
      this.playerMesh.position.z
    );
    
    // Calculate direction from player to opponent
    const direction = new THREE.Vector3().subVectors(
      this.opponentMesh.position,
      this.playerMesh.position
    ).normalize();
    
    // Update player's facing direction
    if (this.player && this.player.updateFacingDirection) {
      // Use a horizontal direction vector (no y component)
      const horizontalDirection = new THREE.Vector3(direction.x, 0, direction.z).normalize();
      this.player.updateFacingDirection(horizontalDirection);
    }
    
    // Move the camera slightly forward in the player's facing direction
    targetPosition.add(direction.clone().multiplyScalar(this.forwardOffset));
    
    // Smoothly move the camera to the new position (with damping)
    this.camera.position.lerp(targetPosition, this.dampingFactor);
    
    // Make the camera look at the opponent
    this.camera.lookAt(this.opponentMesh.position);
  }
}
