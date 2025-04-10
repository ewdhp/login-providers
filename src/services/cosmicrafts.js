import { Actor, HttpAgent } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { idlFactory as cosmicraftsIdlFactory } 
from '../../../../../declarations/cosmicrafts/cosmicrafts.did.js';
import { generateKeysFromSub, base64Decode } from './utils.js';

const cosmicraftsFromSub = async (userId) => {
  const { publicKeyBase64, privateKeyBase64 } = await 
    generateKeysFromSub(userId);
  const identity = Ed25519KeyIdentity
    .fromKeyPair
    (
      base64Decode(publicKeyBase64),
      base64Decode(privateKeyBase64)
    );
  const isLocal = process.env.DFX !== 'ic';
  const host = isLocal ? 'http://localhost:3000' : 'https://ic0.app';
  const agent = new HttpAgent({ identity, host: host });
  if (process.env.NODE_ENV !== 'ic')
    await agent.fetchRootKey();
  return Actor.createActor
  (
    cosmicraftsIdlFactory, 
    { 
      agent, 
      canisterId: process.env.COSMICRAFTS 
    }
  );
};

const cosmicraftsPublic = async () => {
  const agent = new HttpAgent
    ({ host: 'https://ic0.app' });
  if (process.env.NODE_ENV !== 'ic')
    await agent.fetchRootKey();
  return Actor.createActor
  (
    cosmicraftsIdlFactory, 
    { 
      agent, 
      canisterId: process.env.COSMICRAFTS 

    }
  );
};

export { 
  cosmicraftsFromSub, 
  cosmicraftsPublic 
};