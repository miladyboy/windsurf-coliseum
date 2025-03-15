// Mock for socket.io-client
const mockSocket = {
  on: jest.fn(),
  emit: jest.fn(),
  disconnect: jest.fn(),
  id: 'mock-socket-id'
};

const io = jest.fn().mockImplementation(() => mockSocket);
io.connect = jest.fn().mockImplementation(() => mockSocket);

module.exports = io;
