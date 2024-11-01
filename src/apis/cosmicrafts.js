import express from 'express';
import { cosmicrafts } from '../../../../declarations/cosmicrafts/index.js';
import { parseBigIntAndPrincipal } from '../services/motoko/utils.js';

const router = express.Router();

// Define the route for getting all players
router.get('/players', async (req, res) => {
  try {
    console.log('Fetching all players, cosmicrafts.getAllPlayers ...');
    if (!cosmicrafts || !cosmicrafts.getAllPlayers) {
      throw new Error('cosmicrafts.getAllPlayers is not defined');
    }
    const p = await cosmicrafts.getAllPlayers();
    const players = parseBigIntAndPrincipal(p);
    res.status(201).json(parseBigIntAndPrincipal(p));
  } catch (error) {
    console.error('Error in /players route:', error);
    res.status(500).json({ error: 'Failed to get players' });
  }
});

export default router;