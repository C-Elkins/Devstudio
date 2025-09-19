#!/bin/bash

# DevStudio GUI Launcher
# Starts the React+Vite development server for the GUI

echo "🚀 Starting DevStudio GUI..."

# Navigate to the GUI directory and start the development server
cd "$(dirname "$0")/apps/devstudio-gui"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🌐 Opening GUI at http://localhost:5173"
echo "💡 Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev