import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

class SFactory { constructor() {
    this.services = {};
    this.isLoaded = false;
    this.loadServices().then(() => {
      this.isLoaded = true;
      console.log('All services loaded');
    }).catch((err) => console.error
    ('Error loading services:', err));
  }
    
  async waitUntilLoaded() {
    while (!this.isLoaded) 
      await new Promise
      ((resolve) => setTimeout(resolve, 10)); 
  }

  async loadServices() {  
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const sd = path.resolve(__dirname);
    const subdirectories = fs.readdirSync
      (sd, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    for (const subdir of subdirectories) {
      const servicePath = path.join
        (sd, subdir, 'main.js');
      if (fs.existsSync(servicePath)) {
        const ServiceClass = ( 
          await import(servicePath)).default;
        this.services[subdir] = ServiceClass;
      } else console.warn(`Service not found: 
          ${servicePath}`
      );
    }
  }

  async getService(serviceName, ...args) {
    if (!this.isLoaded) throw new Error
      ('Services are not loaded yet');
    const ServiceClass = this.services[serviceName];
    if (!ServiceClass) throw new Error
      (`Service "${serviceName}" not found`);  
    const instance = new ServiceClass(...args);
    return instance;
  }
}

export default new SFactory();