import express from 'express';
import ResponseHandler from '../utils/response.js';
import SFactory from '../services/factory.js';

const router = express.Router();

router.all('/facebook/:action', async (req, res) => {
  console.log('Session:', req.session); // Debugging: Log session data
  console.log('User:', req.user); // Debugging: Log user data
  console.log('Access Token:', req.query.access_token); // Debugging: Log the access token
  console.log('Action:', req.params.action); // Debugging: Log the requested action

  if (!req.query.access_token) {
    return ResponseHandler.unauthorized(res, 'Access token is missing');
  }

  try {
    const { action } = req.params;
    const facebookService = SFactory.getService('facebook', req.query.access_token);

    if (typeof facebookService[action] !== 'function') {
      console.error(`Action "${action}" not found in FacebookService`);
      return ResponseHandler.notFound(res, `Action "${action}" not found in FacebookService`);
    }

    const result = await facebookService[action](req.query);
    return ResponseHandler.success(res, `Facebook ${action} retrieved successfully`, result);
  } catch (error) {
    console.error('Error in /facebook/:action route:', error.message);
    return ResponseHandler.internalError(res, error.message);
  }
});
export const facebookRoutes = router;