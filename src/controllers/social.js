import express from 'express';
import ResponseHandler from '../utils/response.js';
import SFactory from '../services/factory.js';
import { SUPPORTED_PLATFORMS } from '../config/services.js';
import { verifyTokenMiddleware } from '../middleware/token.js';

const router = express.Router();

// Route to handle all social network actions dynamically
router.all('/:platform/:action', verifyTokenMiddleware(), async (req, res) => {
  const { platform, action } = req.params;
  const accessToken = req.accessToken;

  console.log(`Received request for platform: ${platform}, action: ${action}`);

  try {
    // Validate platform
    if (!SUPPORTED_PLATFORMS.includes(platform)) {
      return ResponseHandler.notFound(
        res,
        `The platform "${platform}" is not supported. Supported platforms are: ${SUPPORTED_PLATFORMS.join(', ')}`
      );
    }

    // Dynamically load the service for the specified platform
    const service = SFactory.getService(platform, accessToken);

    // Check if the requested action exists in the service
    if (typeof service[action] !== 'function') {
      return ResponseHandler.notFound(
        res,
        `The action "${action}" is not available for the platform "${platform}". Please check the documentation for available actions.`
      );
    }

    // Execute the action and return the result
    const result = await service[action](req.query);
    return ResponseHandler.success(res, `${platform} ${action} executed successfully`, { data: result });
  } catch (error) {
    console.error(error.stack);
    return ResponseHandler.internalError(res, 'An unexpected error occurred while processing your request.');
  }
});

export const socialRoutes = router;