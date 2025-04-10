import axios from 'axios';

class FacebookService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUrl = 'https://graph.facebook.com/v12.0'; // Facebook Graph API base URL
  }

  // Generic method to handle all Facebook Graph API requests
  async request(endpoint, params = {}) {
    console.log(`Making request to Facebook API: ${endpoint}`);
    try {
      const response = await axios.get(`${this.baseUrl}/${endpoint}`, {
        params: {
          access_token: this.accessToken,
          ...params, // Merge additional parameters
        },
      });
      console.log(`Response from Facebook API (${endpoint}):`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching data from Facebook (${endpoint}):`, error.response?.data || error.message);
      throw new Error(`Failed to fetch data from Facebook (${endpoint})`);
    }
  }

  // Alias for user details
  async user(params) {
    return this.request('me', params);
  }

  // Alias for user friends
  async getUserFriends() {
    return this.request('me/friends');
  }

  // Alias for user photos
  async getUserPhotos() {
    return this.request('me/photos', { type: 'uploaded' });
  }
}

export default FacebookService;