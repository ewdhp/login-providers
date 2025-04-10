import express from 'express';
import ResponseHandler from '../utils/response.js';
import SFactory from '../services/factory.js';

const router = express.Router();

// Middleware to validate access token
const validateAccessToken = (req, res, next) => {
  const { access_token } = req.query;
  if (!access_token) {
    return ResponseHandler.unauthorized(res, 'Access token is missing');
  }
  req.accessToken = access_token;
  next();
};

// Route to handle all Facebook actions dynamically
router.all('/facebook/:action', validateAccessToken, async (req, res) => {
  const { action } = req.params;
  const { accessToken } = req;

  try {
    console.log(`Processing Facebook action: ${action}`);
    const facebookService = SFactory
    getService('facebook', accessToken);
    // Check if the action exists in the FacebookService
    if (typeof facebookService[action] !== 'function') {
      console.error
      (`Action "${action}" 
        not found in FacebookService`);
      return ResponseHandler
      .notFound(res, 
        `Action "${action}" 
        not found in FacebookService`);
    }
    // Call the appropriate method dynamically
    const result = await facebookService[action](req.query);
    console.log(`Action "${action}" 
        executed successfully with result:`, 
        result);

    // Return a consistent response format
    return ResponseHandler.success
    (res, `Facebook ${action} 
        retrieved successfully`, result);
  } catch (error) {
    console.error
    (`Error processing Facebook action "${action}":`,
         error.message);
    return ResponseHandler
    .internalError
    (res, error.message);
  }
});

export const facebookRoutes = router;