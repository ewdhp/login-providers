import axios from 'axios';

class FacebookService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUrl = 'https://graph.facebook.com/v12.0'; // Facebook Graph API base URL
  }

  // Get user details
  async getUserDetails(fields = 'id,name,email') {
    console.log
    ('Fetching user details with access token:', 
      this.accessToken); // Debugging
    try {
      const response = await axios.get(`${this.baseUrl}/me`, {
        params: {
          access_token: this.accessToken,
          fields, // Specify the fields to retrieve
        },
      });
      console.log(
        'User details fetched successfully:', 
        response.data); // Debugging
      return response.data;
    } catch (error) {
      console.error('Error fetching user details from Facebook:', 
        error.response?.data || error.message);
      throw new Error('Failed to fetch user details from Facebook');
    }
  }

  // Alias for `getUserDetails` to support the `user` action
  async user(params) {
    return this.getUserDetails(params.fields);
  }

  // Get user friends
  async getUserFriends() {
    try {
      const response = await axios.get(`${this.baseUrl}/me/friends`, {
        params: {
          access_token: this.accessToken,
        },
      });
      return response.data.data; // Facebook returns friends in the `data` array
    } catch (error) {
      console.error('Error fetching user friends from Facebook:', error.response?.data || error.message);
      throw new Error('Failed to fetch user friends from Facebook');
    }
  }

  // Get user photos
  async getUserPhotos() {
    try {
      const response = await axios.get(`${this.baseUrl}/me/photos`, {
        params: {
          access_token: this.accessToken,
          type: 'uploaded', // Retrieve uploaded photos
        },
      });
      return response.data.data; // Facebook returns photos in the `data` array
    } catch (error) {
      console.error('Error fetching user photos from Facebook:', error.response?.data || error.message);
      throw new Error('Failed to fetch user photos from Facebook');
    }
  }
}

export default FacebookService;
