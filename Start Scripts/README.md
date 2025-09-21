# 🚀 Start Scripts - Quick Development Setup

This folder contains simple, reliable startup scripts for your DevStudio development environment.

## 📁 Available Scripts

### Start Services

- **`start-frontend.sh`** - Start React frontend (port 3000)
- **`start-backend.sh`** - Start backend API (port 5002)
- **`start-database.sh`** - Start MongoDB database (port 27017)
- **`start-everything.sh`** - Start all essential services 🎯

### Stop Services (examples)

- **`stop-frontend.sh`** - Stop React frontend
- **`stop-backend.sh`** - Stop backend API
- **`stop-everything.sh`** - Stop all services 🛑

### Restart Services (examples)

- **`restart-frontend.sh`** - Restart React frontend
- **`restart-backend.sh`** - Restart backend API
- **`restart-everything.sh`** - Restart all services 🔄

## ⚡ Quick Start

### Start Everything (Recommended)

```bash
cd "Start Scripts"
./start-everything.sh
```

### Start Individual Services

```bash
cd "Start Scripts"
./start-frontend.sh      # Main React app
./start-backend.sh       # Backend API
./start-database.sh      # MongoDB
```

### Stop Services

```bash
cd "Start Scripts"
./stop-everything.sh     # Stop all services
./stop-frontend.sh       # Stop just frontend
./stop-backend.sh        # Stop just backend
```

### Restart Services

```bash
cd "Start Scripts"
./restart-everything.sh  # Restart all services
./restart-frontend.sh    # Restart just frontend
./restart-backend.sh     # Restart just backend
```

## 🌐 URLs After Starting

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | [http://localhost:3000](http://localhost:3000) | Main React application |
| **Backend API** | [http://localhost:5002](http://localhost:5002) | Backend API server |
| **Database** | mongodb://localhost:27017 | MongoDB database |

## ✨ Features

- **Auto-install dependencies** if missing
- **Error checking** and helpful messages
- **Port conflict detection**
- **Easy to use** - just run the script!
- **Background startup** for multiple services
- **Clear status messages** and URLs

## 🎯 Recommended Workflow

1. **Start everything:** `./start-everything.sh`
2. **Visit main app:** [http://localhost:3000](http://localhost:3000)

## 🛠️ Troubleshooting

- If a service fails to start, check if the port is already in use
- Scripts will auto-install dependencies if needed
- Use `Ctrl+C` to stop any running service
- Check the console output for specific error messages

---

_Simple, reliable, and easy to use! 🚀_
