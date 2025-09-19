#!/bin/bash
# Start the Control Center API Server
# This manages the GUI and service controls

echo "🚀 Starting Control Center API Server..."

cd "$(dirname "$0")/../../control-center"

if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found in control-center directory"
    echo "   Make sure you're running from the project root"
    exit 1
fi

if lsof -i :3001 > /dev/null 2>&1; then
    echo "⚠️  API Server already running on port 3001"
    echo "   Visit: http://localhost:3001"
else
    echo "   Starting on http://localhost:3001"
    node server.js
fi