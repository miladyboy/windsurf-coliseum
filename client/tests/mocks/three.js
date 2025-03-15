// Mock for three.js
module.exports = {
  Scene: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    background: { set: jest.fn() }
  })),
  PerspectiveCamera: jest.fn(),
  WebGLRenderer: jest.fn().mockImplementation(() => ({
    setSize: jest.fn(),
    render: jest.fn(),
    shadowMap: {
      enabled: false
    },
    domElement: document.createElement('canvas')
  })),
  Mesh: jest.fn().mockImplementation(() => ({
    position: { x: 0, y: 0, z: 0, set: jest.fn(), copy: jest.fn() },
    rotation: { x: 0, y: 0, z: 0, set: jest.fn(), copy: jest.fn() },
    add: jest.fn()
  })),
  BoxGeometry: jest.fn(),
  CircleGeometry: jest.fn(),
  CylinderGeometry: jest.fn(),
  MeshBasicMaterial: jest.fn(),
  MeshLambertMaterial: jest.fn(),
  AmbientLight: jest.fn(),
  DirectionalLight: jest.fn(),
  Group: jest.fn().mockImplementation(() => ({
    add: jest.fn()
  })),
  Vector3: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    copy: jest.fn(),
    addVectors: jest.fn().mockReturnThis(),
    subVectors: jest.fn().mockReturnThis(),
    normalize: jest.fn().mockReturnThis(),
    multiplyScalar: jest.fn().mockReturnThis(),
    lerp: jest.fn(),
    add: jest.fn().mockReturnThis()
  })),
  Color: jest.fn(),
  Clock: jest.fn().mockImplementation(() => ({
    getDelta: jest.fn().mockReturnValue(0.016)
  }))
};
