# DevStudio Project Structure

This document outlines the clean, organized structure of the DevStudio monorepo.

## 📁 Project Structure

```
Testing Grounds/
├── 📱 apps/                    # Main applications
│   ├── backend/               # Node.js API server
│   ├── frontend/              # React portfolio website
│   ├── devstudio-electron/    # Legacy Electron GUI
│   └── devstudio-gui/         # NEW: React+Material-UI GUI
│
├── 🗃️ archive/                # Archived/legacy files
│   └── legacy-structure/      # Old project structure
│
├── 📜 scripts/                # Utility scripts
│   ├── list-contacts.js      # Contact management
│   └── promote_superadmin.sh  # Admin tools
│
├── 📋 start-gui.sh           # Quick GUI launcher
├── 🔧 setup.sh               # Project setup
├── 📦 package.json           # Root package management
└── 📖 README.md              # Main documentation
```

## 🚀 Quick Commands

### Start the Modern GUI
```bash
npm run gui
# or
./start-gui.sh
```

### Development
```bash
npm run dev              # Start backend + frontend
npm run dev:backend      # Start just backend
npm run dev:frontend     # Start just frontend
```

### Setup
```bash
npm run setup           # Initial setup
npm run install:all     # Install all dependencies
```

## 📝 Notes

- **apps/** contains all active applications
- **archive/** contains legacy files and old structure
- **scripts/** contains utility and maintenance scripts
- The new React+Material-UI GUI replaces the old HTML-based Electron interface
- Legacy structure has been preserved in archive/ for reference

## 🔄 Migration Notes

- Old backend/, frontend/, devstudio-electron/ moved to archive/legacy-structure/
- Active development now uses apps/ folder structure
- Package.json scripts updated to reflect new paths
- GUI command now launches the modern React interface