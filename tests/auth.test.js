import app from '../server.js'; // Import the app instance
import supertest from 'supertest';
import { describe, it, expect } from 'vitest';

describe('Authentication and Facebook Dynamic Endpoint Flow', () => {
  const accessToken = 'EAAYfTd0FPvMBO4zgKYScl8KHC0DpJZC8jqvC4EQZCkivGqZCX1ZAUBSF8SjvaiDvytZC12d9gpENW2NWqL3dLCNfJEBeIptyknpaDRSV0pGWQsTHGprSZAsXnDg9cI0nEdyJouqO7AuQ44d6b37xVNEXAgPeu9FiHhdUsUzFekyxjlX2Wr5clInrjzJ0AzRszktr7ZCJn28khBABhYcSzwCANzxPMuhwZCBj4p5VbS3Jn5811dEwpDFYvrAOtug4aiZCM8QZDZD';

  // Step 1: Access the Facebook user details with the access token
  it('should retrieve Facebook user details with the access token', async () => {
     console.log('Sending request to /facebook/user...');
    const res = await supertest(app)
      .get('/facebook/user') // Call the dynamic Facebook endpoint for "user" action
      .query({ access_token: accessToken }); // Pass the access token as a query parameter

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
      .get('/facebook/friends') // Call the dynamic Facebook endpoint for "friends" action
      .query({ access_token: accessToken }); // Pass the access token as a query parameter

    expect(res.status).toBe(200); // Expect 200 OK
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'Facebook friends retrieved successfully');
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true); // Expect the data to be an array
  });

  // Step 3: Access the Facebook photos with the access token
  it('should retrieve Facebook photos with the access token', async () => {
    const res = await supertest(app)
      .get('/facebook/photos') // Call the dynamic Facebook endpoint for "photos" action
      .query({ access_token: accessToken }); // Pass the access token as a query parameter

    expect(res.status).toBe(200); // Expect 200 OK
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'Facebook photos retrieved successfully');
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true); // Expect the data to be an array
  });
});