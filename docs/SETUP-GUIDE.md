# DevStudio Portfolio - Development Environment

A comprehensive full-stack development environment with a Control Center for managing all services.

## 🏗️ Project Structure

```
📁 devstudio-portfolio/
├── 📁 control-center/        # Control Center (Service Management GUI)
│   ├── src/                  # React frontend source
│   ├── server.js             # API server for service management
│   ├── package.json          # Control Center dependencies
│   └── README.md
├── 📁 backend/               # Main backend API server
│   ├── config/               # Database and app configuration
│   ├── models/               # Data models
│   ├── routes/               # API endpoints
│   ├── server.js             # Main backend server
│   └── package.json
├── 📁 frontend/              # Main frontend application
│   ├── src/                  # React frontend source
│   ├── public/               # Static assets
│   ├── package.json          # Frontend dependencies
│   └── README.md
├── 📁 scripts/               # Centralized scripts
│   └── 📁 services/          # Service management scripts
│       ├── start-all.sh      # Start complete environment
│       ├── start-api.sh      # Start Control Center API
│       ├── start-gui.sh      # Start Control Center GUI
│       ├── start-backend.sh  # Start main backend
│       ├── start-frontend.sh # Start main frontend
│       └── start-database.sh # Start MongoDB
├── 📁 apps/                  # Additional applications
│   └── 📁 devstudio-electron/ # Electron desktop app
└── 📄 Documentation files
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB
- Git

### 1. Clone and Setup
```bash
git clone [repository-url]
cd devstudio-portfolio
npm install
```

### 2. Start Everything at Once
```bash
./scripts/services/start-all.sh
```

This will start:
- 🗄️ MongoDB Database (port 27017)
- ⚙️ Backend API (port 5002)
- 🌐 Frontend App (port 3000)  
- 🛠️ Control Center API (port 3001)
- 📱 Control Center GUI (port 5173)

### 3. Access Your Environment
- **Control Center**: http://localhost:5173 ← Start here!
- **Main App**: http://localhost:3000
- **Backend API**: http://localhost:5002

## 🎛️ Control Center Usage

The Control Center is your command hub for managing the entire development environment.

### Features
- **Service Management**: Start/stop all services with one click
- **Real-time Status**: Live monitoring of all service states
- **System Logs**: View detailed logs for debugging
- **Git Integration**: Check repository status
- **Graceful Degradation**: Works even when some services are offline

### ⚠️ API Server Management

The Control Center API server has special behavior:

**Stopping the API Server:**
- Click the API toggle → Warning dialog appears
- Shows restart instructions: `cd control-center && node server.js`
- Confirms you understand the consequences

**Starting the API Server (when offline):**
- Cannot be started from the Control Center (chicken-and-egg problem)
- Use terminal: `./scripts/services/start-api.sh`
- Or manually: `cd control-center && node server.js`

## 📋 Individual Service Management

### Control Center
```bash
# Start API server
./scripts/services/start-api.sh

# Start GUI frontend  
./scripts/services/start-gui.sh

# Manual start
cd control-center
node server.js          # API server
npm run dev             # GUI frontend
```

### Main Backend
```bash
# Using script
./scripts/services/start-backend.sh

# Manual start
cd backend
node server.js
```

### Main Frontend  
```bash
# Using script
./scripts/services/start-frontend.sh

# Manual start
cd frontend
npm start
```

### Database
```bash
# Using script
./scripts/services/start-database.sh

# Manual start (macOS)
brew services start mongodb/brew/mongodb-community
```

## 🐛 Troubleshooting

### Services Won't Start
1. Check if ports are already in use:
   ```bash
   lsof -i :3000    # Frontend
   lsof -i :3001    # Control Center API  
   lsof -i :5002    # Backend
   lsof -i :5173    # Control Center GUI
   ```

2. Kill conflicting processes:
   ```bash
   lsof -ti :PORT | xargs kill -9
   ```

### API Server Won't Restart
- **Problem**: Stopped API server from Control Center
- **Solution**: Start manually:
  ```bash
  cd control-center
  node server.js
  ```

### Control Center Shows Offline
- Check if API server is running: `lsof -i :3001`
- Restart API server: `./scripts/services/start-api.sh`
- Check browser console for errors (F12)

### MongoDB Connection Issues
- Start MongoDB: `./scripts/services/start-database.sh`
- Check MongoDB logs: `brew services list | grep mongo`
- Verify MongoDB config: `/usr/local/etc/mongod.conf`

## 🔧 Development Workflow

### Recommended Workflow
1. **Start with Control Center**: `./scripts/services/start-all.sh`
2. **Use Control Center** to manage other services
3. **Monitor logs** in Control Center for debugging
4. **Access main app** at http://localhost:3000

### Making Changes
- **Frontend changes**: Auto-reload enabled
- **Backend changes**: Restart via Control Center
- **Control Center changes**: Restart API server manually

## 📦 Port Reference

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| Frontend App | 3000 | http://localhost:3000 | Main user application |
| Control Center API | 3001 | http://localhost:3001 | Service management API |
| Backend API | 5002 | http://localhost:5002 | Main backend services |
| Control Center GUI | 5173 | http://localhost:5173 | Service management interface |
| MongoDB | 27017 | mongodb://localhost:27017 | Database |

## 🎯 Key Benefits of This Structure

1. **Centralized Management**: One interface to control everything
2. **Clear Separation**: Each service has its own directory
3. **Easy Scripts**: Standard commands for all operations  
4. **Self-Documenting**: Clear naming and organization
5. **Graceful Failure**: Services work independently when possible

---

**Need Help?** Check the Control Center at http://localhost:5173 for real-time status and logs!