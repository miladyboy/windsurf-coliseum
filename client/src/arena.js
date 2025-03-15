import * as THREE from 'three';

export class Arena {
  constructor() {
    this.size = 50; // Size of the arena
    
    // Create arena mesh
    this.createMesh();
    
    // Add coliseum elements
    this.addColiseumWalls();
  }
  
  createMesh() {
    // Create a circular arena floor
    const geometry = new THREE.CircleGeometry(this.size / 2, 32);
    
    // Create a sandy texture for the coliseum floor
    const material = new THREE.MeshLambertMaterial({ 
      color: 0xD2B48C, // Sandy color
      side: THREE.DoubleSide
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI / 2; // Rotate to lay flat
    this.mesh.receiveShadow = true;
  }
  
  addColiseumWalls() {
    // Create a ring of columns around the arena to represent coliseum walls
    const radius = this.size / 2 + 2; // Slightly larger than the arena
    const columnCount = 24; // Number of columns around the perimeter
    const columnHeight = 8;
    const columnRadius = 1;
    
    // Create a group for the walls
    this.walls = new THREE.Group();
    this.mesh.add(this.walls);
    
    // Create columns
    for (let i = 0; i < columnCount; i++) {
      const angle = (i / columnCount) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      // Column geometry
      const columnGeometry = new THREE.CylinderGeometry(
        columnRadius, 
        columnRadius + 0.2, // Slightly wider at the base
        columnHeight, 
        8
      );
      
      // Column material - marble-like
      const columnMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xEEEEEE // Off-white
      });
      
      // Create column mesh
      const column = new THREE.Mesh(columnGeometry, columnMaterial);
      column.position.set(x, columnHeight / 2, z);
      column.castShadow = true;
      column.receiveShadow = true;
      
      this.walls.add(column);
      
      // Add column caps (simple cylinders)
      const capGeometry = new THREE.CylinderGeometry(
        columnRadius + 0.3, 
        columnRadius + 0.3, 
        0.5, 
        8
      );
      
      const capMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xDDDDDD
      });
      
      // Top cap
      const topCap = new THREE.Mesh(capGeometry, capMaterial);
      topCap.position.y = columnHeight / 2 + 0.25;
      column.add(topCap);
      
      // Bottom cap
      const bottomCap = new THREE.Mesh(capGeometry, capMaterial);
      bottomCap.position.y = -columnHeight / 2 - 0.25;
      column.add(bottomCap);
    }
    
    // Add some variation to the floor with a dirt texture in the center
    const centerCircleGeometry = new THREE.CircleGeometry(this.size / 6, 32);
    const centerCircleMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xA0522D, // Brown
      side: THREE.DoubleSide
    });
    
    const centerCircle = new THREE.Mesh(centerCircleGeometry, centerCircleMaterial);
    centerCircle.rotation.x = -Math.PI / 2;
    centerCircle.position.y = 0.01; // Slightly above the main floor to avoid z-fighting
    this.mesh.add(centerCircle);
  }
}
