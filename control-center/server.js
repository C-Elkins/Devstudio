import express from 'express';
import cors from 'cors';
import { exec, spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// Enable CORS for the React GUI
app.use(cors());
app.use(express.json());

class ServiceManager {
  constructor() {
    this.rootPath = path.resolve(__dirname, '..');
    this.backendPath = path.join(this.rootPath, 'backend');
    this.frontendPath = path.join(this.rootPath, 'frontend');
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
    const [backend, frontend, database, api] = await Promise.all([
      this.checkServiceStatus(5002), // Backend port
      this.checkServiceStatus(3000), // Frontend port  
      this.checkMongoStatus(),
      this.checkServiceStatus(3001)  // API server port
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
      },
      api: {
        running: api,
        port: 3001,
        name: 'Control Center API'
      }
    };
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

  // Start backend service
  async startBackend() {
    if (await this.checkServiceStatus(5002)) {
      return { success: false, message: 'Backend already running' };
    }

    return new Promise((resolve) => {
      const child = spawn('npm', ['run', 'dev:backend'], {
        cwd: this.rootPath,
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: true,
        detached: false
      });

      let hasStarted = false;
      const timeout = setTimeout(() => {
        if (!hasStarted) {
          resolve({ success: false, message: 'Backend startup timeout' });
        }
      }, 10000);

      child.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Server running') || output.includes('listening') || output.includes('started')) {
          if (!hasStarted) {
            hasStarted = true;
            clearTimeout(timeout);
            resolve({ success: true, message: 'Backend started successfully' });
          }
        }
      });

      child.on('error', (error) => {
        if (!hasStarted) {
          hasStarted = true;
          clearTimeout(timeout);
          resolve({ success: false, message: `Failed to start backend: ${error.message}` });
        }
      });
    });
  }

  // Start frontend service
  async startFrontend() {
    if (await this.checkServiceStatus(3000)) {
      return { success: false, message: 'Frontend already running' };
    }

    return new Promise((resolve) => {
      const child = spawn('npm', ['run', 'dev:frontend'], {
        cwd: this.rootPath,
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: true,
        detached: false
      });

      let hasStarted = false;
      const timeout = setTimeout(() => {
        if (!hasStarted) {
          resolve({ success: false, message: 'Frontend startup timeout' });
        }
      }, 15000); // Frontend takes longer to compile

      child.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Compiled successfully') || output.includes('webpack compiled') || output.includes('Local:')) {
          if (!hasStarted) {
            hasStarted = true;
            clearTimeout(timeout);
            resolve({ success: true, message: 'Frontend started successfully' });
          }
        }
      });

      child.on('error', (error) => {
        if (!hasStarted) {
          hasStarted = true;
          clearTimeout(timeout);
          resolve({ success: false, message: `Failed to start frontend: ${error.message}` });
        }
      });
    });
  }

  // Start MongoDB
  async startDatabase() {
    if (await this.checkMongoStatus()) {
      return { success: false, message: 'MongoDB already running' };
    }

    return new Promise((resolve) => {
      exec('brew services start mongodb/brew/mongodb-community', (error) => {
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

  // Start API server (GUI API)
  async startApiServer() {
    if (await this.checkServiceStatus(3001)) {
      return { success: false, message: 'API server already running' };
    }

    return new Promise((resolve) => {
      const child = spawn('node', ['server.js'], {
        cwd: path.join(this.rootPath, 'control-center'),
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: false,
        detached: true
      });

      let hasStarted = false;
      const timeout = setTimeout(() => {
        if (!hasStarted) {
          resolve({ success: false, message: 'API server startup timeout' });
        }
      }, 5000);

      child.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('GUI API server running on')) {
          if (!hasStarted) {
            hasStarted = true;
            clearTimeout(timeout);
            resolve({ success: true, message: 'API server started successfully' });
          }
        }
      });

      child.stderr.on('data', (data) => {
        if (!hasStarted) {
          hasStarted = true;
          clearTimeout(timeout);
          resolve({ success: false, message: `API server error: ${data.toString()}` });
        }
      });

      child.on('error', (error) => {
        if (!hasStarted) {
          hasStarted = true;
          clearTimeout(timeout);
          resolve({ success: false, message: `Failed to start API server: ${error.message}` });
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
      case 'api':
        return await this.stopServiceByPort(3001);
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
      case 'api':
        return await this.startApiServer();
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

const serviceManager = new ServiceManager();

// API Routes
app.get('/api/services/status', async (req, res) => {
  try {
    const status = await serviceManager.getServicesStatus();
    const gitInfo = await serviceManager.getGitStatus();
    res.json({ ...status, git: gitInfo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/services/:service/start', async (req, res) => {
  try {
    const { service } = req.params;
    const result = await serviceManager.startService(service);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/services/:service/stop', async (req, res) => {
  try {
    const { service } = req.params;
    const result = await serviceManager.stopService(service);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/git/:action', async (req, res) => {
  try {
    const { action } = req.params;
    let command;
    
    switch (action) {
      case 'status':
        command = 'git status --porcelain';
        break;
      case 'pull':
        command = 'git pull';
        break;
      case 'push':
        command = 'git push';
        break;
      default:
        return res.status(400).json({ error: 'Invalid git action' });
    }

    exec(command, { cwd: serviceManager.rootPath }, (error, stdout, stderr) => {
      if (error) {
        res.json({ success: false, message: stderr || error.message });
      } else {
        res.json({ success: true, output: stdout });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin endpoints
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  // Simple authentication - replace with proper auth in production
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, message: 'Authentication successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.get('/api/admin/contacts', async (req, res) => {
  try {
    // This would connect to your existing database
    // For now, return mock data
    const contacts = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Interested in web development services',
        date: '2025-09-18',
        status: 'new'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        message: 'Looking for portfolio design consultation',
        date: '2025-09-17',
        status: 'read'
      }
    ];
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/admin/projects', async (req, res) => {
  try {
    // This would connect to your existing database
    const projects = [
      {
        id: 1,
        title: 'DevStudio Portfolio',
        description: 'Personal portfolio and development environment',
        status: 'active',
        technologies: ['React', 'Node.js', 'MongoDB'],
        date: '2025-09-01'
      }
    ];
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/admin/testimonials', async (req, res) => {
  try {
    // This would connect to your existing database
    const testimonials = [
      {
        id: 1,
        author: 'Client Name',
        company: 'Tech Corp',
        message: 'Excellent work on our project!',
        rating: 5,
        date: '2025-09-10',
        featured: true
      }
    ];
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Settings endpoints
app.get('/api/settings', (req, res) => {
  // Return current settings from config file or database
  const settings = {
    autoStart: { backend: false, frontend: false, database: false },
    ports: { backend: 5002, frontend: 3000, gui: 3001 },
    theme: 'light',
    enableNotifications: true,
    enableLogs: true,
    projectPath: serviceManager.rootPath
  };
  res.json({ success: true, data: settings });
});

app.post('/api/settings', (req, res) => {
  const settings = req.body;
  // Save settings to config file or database
  // For now, just acknowledge and log what was received
  console.log('Received settings update:', settings);
  res.json({ success: true, message: 'Settings saved successfully' });
});

// Quick action endpoints
app.post('/api/actions/:action', async (req, res) => {
  const { action } = req.params;
  
  try {
    switch (action) {
      case 'vscode':
        await execAsync('code .');
        res.json({ success: true, message: 'VS Code opened' });
        break;
        
      case 'finder':
        await execAsync('open .');
        res.json({ success: true, message: 'Finder opened' });
        break;
        
      case 'website':
        // Open the frontend website
        await execAsync('open http://localhost:3000');
        res.json({ success: true, message: 'Website opened in browser' });
        break;
        
      default:
        res.status(400).json({ success: false, message: 'Unknown action' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(port, () => {
  console.log(`GUI API server running on http://localhost:${port}`);
});

export default app;