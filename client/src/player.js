import * as THREE from 'three';

export class Player {
  constructor() {
    // Player constants
    this.moveSpeed = 5;
    this.attackDuration = 0.5;
    this.blockDuration = 0.5;
    
    // Player state
    this.attackState = null;  // left, right, up, down, or null
    this.blockState = null;   // left, right, up, down, or null
    this.attackTimer = 0;
    this.blockTimer = 0;
    
    // Direction the player is facing (updated by camera)
    this.facingDirection = new THREE.Vector3(0, 0, -1);
    
    // Create player mesh
    this.createMesh();
    
    // Create sword
    this.createSword();
  }
  
  createMesh() {
    // Create a simple cube for the player body
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshLambertMaterial({ color: 0x0000FF });
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
    
    // Position the sword in the player's right hand
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
  
  // Update the player's facing direction (called from camera controller)
  updateFacingDirection(direction) {
    this.facingDirection.copy(direction);
    // Update the mesh rotation to face in the direction of movement
    if (direction.length() > 0) {
      this.mesh.lookAt(
        this.mesh.position.x + direction.x,
        this.mesh.position.y,
        this.mesh.position.z + direction.z
      );
    }
  }
  
  moveForward(delta) {
    // Move in the direction the player is facing
    const moveVector = this.facingDirection.clone().multiplyScalar(this.moveSpeed * delta);
    this.mesh.position.add(moveVector);
  }
  
  moveBackward(delta) {
    // Move opposite to the direction the player is facing
    const moveVector = this.facingDirection.clone().multiplyScalar(-this.moveSpeed * delta);
    this.mesh.position.add(moveVector);
  }
  
  moveLeft(delta) {
    // Move perpendicular to the facing direction (left)
    const strafeVector = new THREE.Vector3(this.facingDirection.z, 0, -this.facingDirection.x);
    strafeVector.normalize().multiplyScalar(this.moveSpeed * delta);
    this.mesh.position.add(strafeVector);
  }
  
  moveRight(delta) {
    // Move perpendicular to the facing direction (right)
    const strafeVector = new THREE.Vector3(-this.facingDirection.z, 0, this.facingDirection.x);
    strafeVector.normalize().multiplyScalar(this.moveSpeed * delta);
    this.mesh.position.add(strafeVector);
  }
  
  attack(direction) {
    if (!this.attackState && !this.blockState) {
      this.attackState = direction;
      this.attackTimer = this.attackDuration;
      this.updateSwordPosition();
    }
  }
  
  block(direction) {
    if (!this.attackState && !this.blockState) {
      this.blockState = direction;
      this.blockTimer = this.blockDuration;
      this.updateSwordPosition();
    }
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
  
  update(delta) {
    // Update attack
    if (this.attackState) {
      this.attackTimer -= delta;
      if (this.attackTimer <= 0) {
        this.attackState = null;
        this.updateSwordPosition();
      }
    }
    
    // Update block
    if (this.blockState) {
      this.blockTimer -= delta;
      if (this.blockTimer <= 0) {
        this.blockState = null;
        this.updateSwordPosition();
      }
    }
    
    // Constrain player to arena
    const arenaSize = 50; // Size of the arena
    const halfArenaSize = arenaSize / 2;
    
    if (this.mesh.position.x < -halfArenaSize) this.mesh.position.x = -halfArenaSize;
    if (this.mesh.position.x > halfArenaSize) this.mesh.position.x = halfArenaSize;
    if (this.mesh.position.z < -halfArenaSize) this.mesh.position.z = -halfArenaSize;
    if (this.mesh.position.z > halfArenaSize) this.mesh.position.z = halfArenaSize;
  }
  
  isAttacking() {
    return this.attackState !== null;
  }
  
  isBlocking() {
    return this.blockState !== null;
  }
  
  isBlockingCorrectly(attackDirection) {
    // Check if the player is blocking in the opposite direction of the attack
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
