import BaseService from '../BaseService.js';

class FacebookService extends BaseService {
  constructor(accessToken) {
    super(accessToken, 
      'https://graph.facebook.com/v12.0');
  }

  async user(params) {
    return this.request('me', params);
  }
}

export default FacebookService;