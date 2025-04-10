import app from '../server.js'; // Import the app instance
import supertest from 'supertest';
import { describe, it, expect } from 'vitest';

describe('Authentication and Facebook Dynamic Endpoint Flow', () => {
  const serverToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMjEwOTMzODgwNDQ2MDU2MyIsImlhdCI6MTc0NDI0NDYxNCwiZXhwIjoxNzQ0MjQ4MjE0fQ.nNRMPWRPpWVNdaEADj_zOHkJW228J8B7Zix9xa2iZ0A';
  const facebookAccessToken = 'EAAYfTd0FPvMBO7aDQrGxqPgrzFE1iipin7UpKqaNftfE1vaVStpPCP3bpZCxL0WMbHF1cIBMiJgdqOwmrG3lqRcYs7aZCdNxc5LyHZCuQzNT0XirLK00hs9OXy0KCbJqlnaGyZClZCoB4gsdrJNYK7aw2AySFpN5f6tmskqJbWQnxppl0EWv8vWg5uFkmjQl0bBytckG7OPC5UCdq89UtBhSH5C1KkI8OltzA4li9DfaExmbut3noZCXCudzDCkyUDXAZDZD';

  // Step 1: Access the Facebook user details with the access token
  it('should retrieve Facebook user details with the access token', async () => {
    console.log('Sending request to /facebook/user...');
    const res = await supertest(app)
      .get('/api/facebook/user') // Call the dynamic Facebook endpoint for "user" action
      .query({ access_token: facebookAccessToken }) // Pass the Facebook access token as a query parameter
      .set('Authorization', `Bearer ${serverToken}`); // Pass the server token in the Authorization header

    expect(res.status).toBe(200); // Expect 200 OK
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'Facebook user retrieved successfully');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('id'); // Facebook user ID
    expect(res.body.data).toHaveProperty('name'); // Facebook user name
  });

  // Step 2: Access the Facebook friends list with the access token
  it('should retrieve Facebook friends with the access token', async () => {
    const res = await supertest(app)
      .get('/api/facebook/friends') // Call the dynamic Facebook endpoint for "friends" action
      .query({ access_token: facebookAccessToken }) // Pass the Facebook access token as a query parameter
      .set('Authorization', `Bearer ${serverToken}`); // Pass the server token in the Authorization header

    expect(res.status).toBe(200); // Expect 200 OK
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'Facebook friends retrieved successfully');
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true); // Expect the data to be an array
  });

  // Step 3: Access the Facebook photos with the access token
  it('should retrieve Facebook photos with the access token', async () => {
    const res = await supertest(app)
      .get('/api/facebook/photos') // Call the dynamic Facebook endpoint for "photos" action
      .query({ access_token: facebookAccessToken }) // Pass the Facebook access token as a query parameter
      .set('Authorization', `Bearer ${serverToken}`); // Pass the server token in the Authorization header

    expect(res.status).toBe(200); // Expect 200 OK
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'Facebook photos retrieved successfully');
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true); // Expect the data to be an array
  });
});