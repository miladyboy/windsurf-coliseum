import * as THREE from 'three';

export class Opponent {
  constructor() {
    // Opponent state
    this.attackState = null;  // left, right, up, down, or null
    this.blockState = null;   // left, right, up, down, or null
    
    // Create opponent mesh
    this.createMesh();
    
    // Create sword
    this.createSword();
  }
  
  createMesh() {
    // Create a simple cube for the opponent body (red to distinguish from blue player)
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.y = 1; // Position above ground
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }
  
  createSword() {
    // Create a simple cylinder for the sword
    const geometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const material = new THREE.MeshLambertMaterial({ color: 0xCCCCCC });
    this.sword = new THREE.Mesh(geometry, material);
    
    // Position the sword in the opponent's right hand
    this.sword.position.set(0.5, 0, 0);
    this.sword.rotation.set(0, 0, -Math.PI / 2); // Sword points outward
    this.mesh.add(this.sword);
    
    // Create sword handle
    const handleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 8);
    const handleMaterial = new THREE.MeshLambertMaterial({ color: 0x4A2700 });
    this.swordHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    this.swordHandle.position.set(-0.8, 0, 0);
    this.sword.add(this.swordHandle);
  }
  
  updateSwordPosition() {
    // Reset sword position
    this.sword.rotation.set(0, 0, -Math.PI / 2);
    
    // Position sword based on attack or block direction
    if (this.attackState) {
      switch (this.attackState) {
        case 'left':
          this.sword.rotation.z = -Math.PI / 4;
          this.sword.rotation.y = -Math.PI / 4;
          break;
        case 'right':
          this.sword.rotation.z = -Math.PI / 4;
          this.sword.rotation.y = Math.PI / 4;
          break;
        case 'up':
          this.sword.rotation.z = -Math.PI / 2;
          this.sword.rotation.x = -Math.PI / 4;
          break;
        case 'down':
          this.sword.rotation.z = -Math.PI / 2;
          this.sword.rotation.x = Math.PI / 4;
          break;
      }
    } else if (this.blockState) {
      // For blocking, hold the sword defensively
      this.sword.rotation.z = -Math.PI / 2;
      
      switch (this.blockState) {
        case 'left':
          this.sword.rotation.y = -Math.PI / 2;
          break;
        case 'right':
          this.sword.rotation.y = Math.PI / 2;
          break;
        case 'up':
          this.sword.rotation.x = -Math.PI / 2;
          break;
        case 'down':
          this.sword.rotation.x = Math.PI / 2;
          break;
      }
    }
  }
  
  update() {
    // Update sword position based on current states
    this.updateSwordPosition();
  }
  
  isAttacking() {
    return this.attackState !== null;
  }
  
  isBlocking() {
    return this.blockState !== null;
  }
  
  isBlockingCorrectly(attackDirection) {
    // Check if the opponent is blocking in the opposite direction of the attack
    if (!this.isBlocking()) return false;
    
    const oppositeDirections = {
      'left': 'right',
      'right': 'left',
      'up': 'down',
      'down': 'up'
    };
    
    return this.blockState === oppositeDirections[attackDirection];
  }
}
