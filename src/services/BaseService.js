import axios from 'axios';

class BaseService {
  constructor(accessToken, baseUrl) {
    this.accessToken = accessToken;
    this.baseUrl = baseUrl;
  }

  async request(endpoint, params = {}, method = 'GET') {
    try {
      const response = await axios({
        method,
        url: `${this.baseUrl}/${endpoint}`,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch from ${this.baseUrl} (${endpoint}): ${error.message}`);
    }
  }
}

export default BaseService;