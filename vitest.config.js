import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Enable global test functions like `describe`, `it`, etc.
    environment: 'node', // Use Node.js environment for backend testing
    coverage: {
      provider: 'c8', // Enable code coverage
      reporter: ['text', 'html'], // Output coverage reports
    },
  },
});