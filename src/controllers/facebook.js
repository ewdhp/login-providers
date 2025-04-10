import express from 'express';
import ResponseHandler from '../utils/response.js';
import SFactory from '../services/factory.js';

const router = express.Router();

// Middleware to validate access token
const validateAccessToken = (req, res, next) => {
  const { access_token } = req.query;
  if (!access_token) {
    return ResponseHandler.unauthorized
    (res, 'Access token is missing');
  }
  req.accessToken = access_token; 
  next();
};

// Route to handle all Facebook actions dynamically
router.all('/facebook/:action', 
  validateAccessToken, async (req, res) => {
  const { action } = req.params;
  const { accessToken } = req;
  try {
    const fbs = SFactory.getService
      ('facebook', accessToken);
    if (typeof fbs
      [action] !== 'function')
      return ResponseHandler.notFound
        (res, `Action "${action}" 
        not found in FacebookService`);
    const result = await fbs[action](req.query);  
    return ResponseHandler.success
    (res, `Facebook ${action} 
      retrieved successfully`, 
      { data: result });
  } catch (error) {
    console.error(error.stack); 
    return ResponseHandler
      .internalError
      (res, error.message);
  }
});

export const facebookRoutes = router;