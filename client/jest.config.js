module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js'],
  testMatch: ['**/tests/**/*.test.js'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  // Mock for three.js
  moduleNameMapper: {
    '^three$': '<rootDir>/tests/mocks/three.js',
    'socket.io-client': '<rootDir>/tests/mocks/socket.io-client.js'
  }
};
