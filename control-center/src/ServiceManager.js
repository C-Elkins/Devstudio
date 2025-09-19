const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class ServiceManager {
  constructor() {
    this.rootPath = path.resolve(__dirname, '../..');
    this.backendPath = path.join(this.rootPath, 'apps/backend/backend');
    this.frontendPath = path.join(this.rootPath, 'apps/frontend/frontend');
    this.processes = new Map();
  }

  // Check if a service is running by checking port
  async checkServiceStatus(port) {
    return new Promise((resolve) => {
      exec(`lsof -i :${port}`, (error, stdout) => {
        if (error) {
          resolve(false);
        } else {
          resolve(stdout.trim().length > 0);
        }
      });
    });
  }

  // Check MongoDB status
  async checkMongoStatus() {
    return new Promise((resolve) => {
      exec('pgrep mongod', (error, stdout) => {
        if (error) {
          resolve(false);
        } else {
          resolve(stdout.trim().length > 0);
        }
      });
    });
  }

  // Get comprehensive status of all services
  async getServicesStatus() {
    const [backend, frontend, database] = await Promise.all([
      this.checkServiceStatus(5002), // Backend port
      this.checkServiceStatus(3000), // Frontend port  
      this.checkMongoStatus()
    ]);

    return {
      backend: {
        running: backend,
        port: 5002,
        name: 'Backend API'
      },
      frontend: {
        running: frontend,
        port: 3000,
        name: 'Frontend React App'
      },
      database: {
        running: database,
        name: 'MongoDB'
      }
    };
  }

  // Start backend service
  async startBackend() {
    if (await this.checkServiceStatus(5002)) {
      return { success: false, message: 'Backend already running' };
    }

    return new Promise((resolve) => {
      const backendProcess = spawn('npm', ['start'], {
        cwd: this.backendPath,
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: true
      });

      this.processes.set('backend', backendProcess);

      backendProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Server started')) {
          resolve({ success: true, message: 'Backend started successfully' });
        }
      });

      backendProcess.stderr.on('data', (data) => {
        console.error('Backend error:', data.toString());
      });

      backendProcess.on('error', (error) => {
        resolve({ success: false, message: `Failed to start backend: ${error.message}` });
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        resolve({ success: false, message: 'Backend start timeout' });
      }, 10000);
    });
  }

  // Start frontend service
  async startFrontend() {
    if (await this.checkServiceStatus(3000)) {
      return { success: false, message: 'Frontend already running' };
    }

    return new Promise((resolve) => {
      const frontendProcess = spawn('npm', ['start'], {
        cwd: this.frontendPath,
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: true
      });

      this.processes.set('frontend', frontendProcess);

      frontendProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('webpack compiled') || output.includes('Local:')) {
          resolve({ success: true, message: 'Frontend started successfully' });
        }
      });

      frontendProcess.stderr.on('data', (data) => {
        console.error('Frontend error:', data.toString());
      });

      frontendProcess.on('error', (error) => {
        resolve({ success: false, message: `Failed to start frontend: ${error.message}` });
      });

      // Timeout after 15 seconds
      setTimeout(() => {
        resolve({ success: false, message: 'Frontend start timeout' });
      }, 15000);
    });
  }

  // Start MongoDB
  async startDatabase() {
    if (await this.checkMongoStatus()) {
      return { success: false, message: 'MongoDB already running' };
    }

    return new Promise((resolve) => {
      exec('brew services start mongodb/brew/mongodb-community', (error, stdout, stderr) => {
        if (error) {
          // Try alternative start method
          exec('mongod --config /usr/local/etc/mongod.conf --fork', (error2) => {
            if (error2) {
              resolve({ success: false, message: 'Failed to start MongoDB' });
            } else {
              resolve({ success: true, message: 'MongoDB started successfully' });
            }
          });
        } else {
          resolve({ success: true, message: 'MongoDB started successfully' });
        }
      });
    });
  }

  // Stop service by port
  async stopServiceByPort(port) {
    return new Promise((resolve) => {
      exec(`lsof -ti :${port} | xargs kill -9`, (error) => {
        if (error) {
          resolve({ success: false, message: `No process found on port ${port}` });
        } else {
          resolve({ success: true, message: `Service on port ${port} stopped` });
        }
      });
    });
  }

  // Stop MongoDB
  async stopDatabase() {
    return new Promise((resolve) => {
      exec('brew services stop mongodb/brew/mongodb-community', (error) => {
        if (error) {
          // Try alternative stop method
          exec('pkill mongod', (error2) => {
            if (error2) {
              resolve({ success: false, message: 'Failed to stop MongoDB' });
            } else {
              resolve({ success: true, message: 'MongoDB stopped successfully' });
            }
          });
        } else {
          resolve({ success: true, message: 'MongoDB stopped successfully' });
        }
      });
    });
  }

  // Stop specific service
  async stopService(serviceName) {
    switch (serviceName) {
      case 'backend':
        return await this.stopServiceByPort(5002);
      case 'frontend':
        return await this.stopServiceByPort(3000);
      case 'database':
        return await this.stopDatabase();
      default:
        return { success: false, message: 'Unknown service' };
    }
  }

  // Start specific service
  async startService(serviceName) {
    switch (serviceName) {
      case 'backend':
        return await this.startBackend();
      case 'frontend':
        return await this.startFrontend();
      case 'database':
        return await this.startDatabase();
      default:
        return { success: false, message: 'Unknown service' };
    }
  }

  // Get Git status
  async getGitStatus() {
    return new Promise((resolve) => {
      exec('git branch --show-current', { cwd: this.rootPath }, (error, stdout) => {
        if (error) {
          resolve('No Git');
        } else {
          const branch = stdout.trim();
          exec('git log --oneline -n 1', { cwd: this.rootPath }, (error2, stdout2) => {
            if (error2) {
              resolve(branch);
            } else {
              const commit = stdout2.trim().split(' ')[0];
              resolve(`${branch} @ ${commit}`);
            }
          });
        }
      });
    });
  }
}

module.exports = ServiceManager;