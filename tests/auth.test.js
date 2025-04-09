import app from '../server.js'; // Import the app instance
import TokenService from '../src/services/token/jwt_token.js';
import supertest from 'supertest';
import { describe, it, expect } from 'vitest';

describe('Authentication and Protected Route Flow', () => {
  let token;

  // Step 1: Simulate Facebook login and generate a token
  it('should generate a token after successful login', () => {
    const mockUser = { id: '12345', email: 'testuser@example.com' }; // Mock user data
    token = TokenService.generateToken(mockUser); // Generate a token
    expect(token).toBeTypeOf('string');
  });

  // Step 2: Access the protected route with the token
  it('should access the protected route with a valid token', async () => {
    const res = await supertest(app)
      .get('/api/protected') // Call the protected route
      .set('Authorization', `Bearer ${token}`); // Set the token in the Authorization header

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'You have accessed a protected route!');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('id', '12345');
    expect(res.body.user).toHaveProperty('email', 'testuser@example.com');
  });

  // Step 3: Test with an invalid token
  it('should fail to access the protected route with an invalid token', async () => {
    const res = await supertest(app)
      .get('/api/protected')
      .set('Authorization', 'Bearer invalidtoken'); // Use an invalid token

    expect(res.status).toBe(403); // Forbidden
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Invalid token');
  });

  // Step 4: Test without a token
  it('should fail to access the protected route without a token', async () => {
    const res = await supertest(app)
      .get('/api/protected');

    expect(res.status).toBe(401); // Unauthorized
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Token missing');
  });
});