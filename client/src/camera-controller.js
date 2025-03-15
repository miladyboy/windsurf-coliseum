import * as THREE from 'three';

export class CameraController {
  constructor(camera, playerMesh, opponentMesh) {
    this.camera = camera;
    this.playerMesh = playerMesh;
    this.opponentMesh = opponentMesh;
    
    // Camera settings
    this.height = 15;         // Height above the players
    this.distance = 20;       // Distance from the midpoint
    this.dampingFactor = 0.1; // Smoothing factor for camera movement
    
    // Initial position
    this.updateCameraPosition();
  }
  
  update(delta) {
    this.updateCameraPosition();
  }
  
  updateCameraPosition() {
    // Calculate the midpoint between the two players
    const midpoint = new THREE.Vector3().addVectors(
      this.playerMesh.position,
      this.opponentMesh.position
    ).multiplyScalar(0.5);
    
    // Calculate the direction vector from player to opponent
    const direction = new THREE.Vector3().subVectors(
      this.opponentMesh.position,
      this.playerMesh.position
    ).normalize();
    
    // Calculate the perpendicular vector to get a side view
    // This ensures the camera is positioned to see both players from the side
    const perpendicular = new THREE.Vector3(-direction.z, 0, direction.x).normalize();
    
    // Calculate the target camera position
    const targetPosition = new THREE.Vector3()
      .copy(midpoint)
      .add(perpendicular.multiplyScalar(this.distance));
    
    // Set the camera height
    targetPosition.y = this.height;
    
    // Smoothly move the camera to the new position (with damping)
    this.camera.position.lerp(targetPosition, this.dampingFactor);
    
    // Make the camera look at the midpoint
    this.camera.lookAt(midpoint);
  }
}
