module.exports = {
  // Set the root directory for Jest
    testEnvironment: 'node',
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    testMatch: ['**/test/**/*.test.js'], // Ensure this matches your test file paths
  };