import BaseService from '../BaseService.js';

class TwitterService extends BaseService {
  constructor(accessToken) {
    super(accessToken, 
        'https://api.twitter.com/2');
  }

  async user(params) {
    return this.request('users/me', params);
  }

  async post(params) {
    return this.request('tweets', params, 'POST');
  }
}

export default TwitterService;