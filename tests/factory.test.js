import { describe, it, expect, beforeAll } from 'vitest';
import SFactory from '../src/services/factory.js';

describe('SFactory Service Loader', () => {
  beforeAll(async () => {
    console.log('Loading services...');
    await SFactory.loadServices(); 
    await SFactory.waitUntilLoaded(); });
  it('should load all available services', () => {
    const availableServices = Object.keys(SFactory.services);
    console.log('Available services:', availableServices);
    expect(availableServices).toContain('facebook'); 
  });

});