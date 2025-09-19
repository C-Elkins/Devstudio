#!/bin/bash
# Start the Backend API Server
# This provides the main application API

echo "⚙️  Starting Backend API Server..."

cd "$(dirname "$0")/../../backend"

if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found in backend directory"
    echo "   Make sure you're running from the project root"
    exit 1
fi

if lsof -i :5002 > /dev/null 2>&1; then
    echo "⚠️  Backend already running on port 5002"
    echo "   API available at: http://localhost:5002"
else
    echo "   Starting on http://localhost:5002"
    node server.js
fi