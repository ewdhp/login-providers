import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

class SFactory {
  constructor() {
    this.services = {};
    this.loadServices();
  }

  // Dynamically load all services with a `main.js` file
  async loadServices() {
    // Emulate __dirname in ES modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const servicesDir = path.resolve(__dirname); // Path to the `services` directory

    // Read all subdirectories in the `services` directory
    const subdirectories = fs.readdirSync(servicesDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory()) // Only include directories
      .map((dirent) => dirent.name);

    // Dynamically import `main.js` from each subdirectory
    for (const subdir of subdirectories) {
      const servicePath = path.join(servicesDir, subdir, 'main.js');
      if (fs.existsSync(servicePath)) {
        const ServiceClass = (await import(servicePath)).default; // Use dynamic import
        this.services[subdir] = ServiceClass; // Map the service name to the class
      }
    }
  }

  // Get a service instance dynamically
  getService(serviceName, ...args) {
    const ServiceClass = this.services[serviceName];
    if (!ServiceClass) {
      throw new Error(`Service "${serviceName}" not found`);
    }
    return new ServiceClass(...args); // Create a new instance with the provided arguments
  }
}

export default new SFactory();