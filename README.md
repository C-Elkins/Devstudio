# 🎨 DevStudio Portfolio

<div align="center">

![DevStudio Banner](https://img.shields.io/badge/DevStudio-Portfolio-blue?style=for-the-badge&logo=react)

**A modern, full-stack portfolio website with integrated service management**

[![CI/CD](https://github.com/C-Elkins/Devstudio-portfolio/actions/workflows/nodejs.yml/badge.svg)](https://github.com/C-Elkins/Devstudio-portfolio/actions/workflows/nodejs.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-%5E18.2.0-blue)](https://reactjs.org/)

[🚀 Live Demo](#) • [📖 Documentation](docs/) • [🛠️ Installation](#installation) • [🎮 Control Center](#control-center)

</div>

## ✨ Features

### 🌟 **Frontend Portfolio**
- **Modern React App** - Sleek, responsive design with glassmorphism effects
- **Interactive Components** - Smooth animations and 3D project showcases
- **Mobile-First Design** - Optimized for all devices and screen sizes
- **SEO Optimized** - Built-in meta tags and structured data

### 🔧 **Backend API**
- **RESTful API** - Node.js + Express with MongoDB integration
- **Admin Dashboard** - Secure content management system
- **Contact Forms** - Automated inquiry handling and notifications
- **Project Management** - CRUD operations for portfolio projects

### 🎛️ **Control Center** ⭐
- **Service Management** - Start, stop, and monitor all services from one interface
- **Real-Time Status** - Live monitoring of frontend, backend, database, and API
- **Offline Capability** - Works even when services are down
- **Modern UI** - Built with React + Material-UI for a premium experience

## 🚀 Quick Start

### One-Command Setup
```bash
# Clone the repository
git clone https://github.com/C-Elkins/Devstudio-portfolio.git
cd Devstudio-portfolio

# Start everything instantly
cd "Start Scripts"
./start-everything.sh
```

### 🌐 Access Your Applications
- **📱 Main Portfolio:** [http://localhost:3000](http://localhost:3000)
- **🎛️ Control Center:** [http://localhost:5173](http://localhost:5173)
- **⚙️ Backend API:** [http://localhost:5002](http://localhost:5002)
- **🗄️ Database:** `mongodb://localhost:27017`

## 📁 Project Architecture

```
DevStudio-Portfolio/
├── 🏠 frontend/              # React portfolio website
├── ⚙️  backend/               # Node.js API server  
├── 🎛️  control-center/        # Service management GUI
├── 🚀 Start Scripts/          # Easy service management
│   ├── start-everything.sh    # Launch all services
│   ├── stop-everything.sh     # Stop all services
│   └── restart-everything.sh  # Restart all services
├── 📜 scripts/               # Additional utilities
├── 📚 docs/                  # Documentation
└── ⚙️  config/                # Configuration files
```

## 🛠️ Installation

### Prerequisites
- **Node.js** 18+ 
- **MongoDB** (local or cloud)
- **Git**

### Manual Setup
```bash
# 1. Install dependencies
npm run install:all

# 2. Configure environment
cp config/.env.example config/.env
# Edit config/.env with your settings

# 3. Start services individually
./scripts/services/start-database.sh
./scripts/services/start-backend.sh
./scripts/services/start-frontend.sh
./scripts/services/start-control-center.sh
```

## 🎮 Control Center

The **DevStudio Control Center** is a modern React application that provides comprehensive service management:

### Features
- 🔴 **Service Status** - Real-time monitoring of all components
- ⚡ **Quick Actions** - Start/stop services with one click
- 📊 **System Info** - Git branch, commit status, and service health
- 🌙 **Offline Mode** - Graceful degradation when API is unavailable
- 🎨 **Modern UI** - Material-UI components with smooth animations

### Screenshots
```bash
# Launch the Control Center
npm run gui
# Visit: http://localhost:5173
```

## 🚀 Easy Service Management

### Start Scripts Folder
We've created a dedicated **"Start Scripts"** folder for effortless service management:

```bash
cd "Start Scripts"

# 🚀 Start all services
./start-everything.sh

# 🛑 Stop all services  
./stop-everything.sh

# 🔄 Restart all services
./restart-everything.sh

# Individual service control
./start-frontend.sh
./start-backend.sh
./start-control-center.sh
```

## 🔧 Development

### Available Scripts

#### Root Level
```bash
npm run gui              # Launch Control Center
npm run dev              # Start backend + frontend
npm run install:all      # Install all dependencies
npm run build            # Build frontend for production
```

#### Frontend
```bash
cd frontend
npm start               # Development server
npm run build          # Production build
npm test               # Run tests
npm run lint           # ESLint check
```

#### Backend
```bash
cd backend
npm run dev            # Development server (nodemon)
npm start             # Production server
npm test              # Run tests
```

#### Control Center
```bash
cd control-center
npm run dev           # Development server (Vite)
npm run build         # Production build
npm run server        # API server
```

## 🌟 Tech Stack

### Frontend
- **React** 18+ - Modern UI library
- **Material-UI** - Premium component library
- **Lucide React** - Beautiful icons
- **CSS3** - Custom styling with glassmorphism
- **Vite** - Lightning-fast build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **Helmet** - Security middleware

### DevOps
- **GitHub Actions** - CI/CD pipeline
- **ESLint** - Code linting
- **Nodemon** - Development auto-restart

## 📖 Documentation

- [📋 Setup Guide](docs/SETUP-GUIDE.md)
- [🏗️ Project Structure](docs/PROJECT_STRUCTURE.md) 
- [🤝 Contributing](docs/CONTRIBUTING.md)
- [🔒 Security](docs/SECURITY_AUDIT.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Chase Elkins**
- GitHub: [@C-Elkins](https://github.com/C-Elkins)
- Portfolio: [Your Portfolio URL]

## ⭐ Show Your Support

Give a ⭐ if this project helped you!

---

<div align="center">

**Built with ❤️ using React, Node.js, and MongoDB**

*Professional portfolio solution with integrated service management*

</div>