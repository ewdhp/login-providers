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
  req.accessToken = access_token; // Attach the access token to the request object
  next();
};

// Route to handle all Facebook actions dynamically
router.all('/facebook/:action', validateAccessToken, async (req, res) => {
  const { action } = req.params; // Extract the action from the route
  const { accessToken } = req;

  try {
    const facebookService = SFactory.getService('facebook', accessToken);

    // Dynamically call the method based on the action
    if (typeof facebookService[action] !== 'function') {
      return ResponseHandler.notFound(res, `Action "${action}" not found in FacebookService`);
    }

    const result = await facebookService[action](req.query); // Call the method dynamically
    return ResponseHandler.success(res, `Facebook ${action} retrieved successfully`, result);
  } catch (error) {
    return ResponseHandler.internalError(res, error.message);
  }
});

export const facebookRoutes = router;