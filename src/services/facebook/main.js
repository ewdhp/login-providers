import axios from 'axios';

class FacebookService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUrl = 'https://graph.facebook.com/v12.0';
  }

  async request(endpoint, params = {}) {
    try {
      const response = await axios
        .get(`${this.baseUrl}/${endpoint}`, {
          params: {
            access_token: this.accessToken,
            ...params,
          },
      });
      return response.data;
    } catch (error) {
      throw new Error
      (`Failed to fetch from Facebook 
        (${endpoint}): 
        ${error.message}`);
    }
  }

  async user(params) {
    return this.request
    ('me', params);
  }
}

export default FacebookService;