import { beforeAll, afterAll } from 'vitest';

// Setup test environment
beforeAll(() => {
  // Allow setting NODE_ENV in test environment
  (process.env as any).NODE_ENV = 'test';
  process.env.MONGODB_URI = 'mongodb://localhost:27017';
  process.env.MONGODB_DBNAME = 'blumea_test';
  process.env.NEXTAUTH_SECRET = 'test-secret-key-that-is-at-least-32-characters-long';
  process.env.NEXTAUTH_URL = 'http://localhost:3000';
});

afterAll(() => {
  // Cleanup
});
