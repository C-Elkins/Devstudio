#!/bin/bash

# 🚀 Start Control Center API
# Port: 3001

echo "🚀 Starting Control Center API..."
echo "📍 Port: 3001"
echo "🌐 URL: http://localhost:3001"
echo "----------------------------------------"

cd "$(dirname "$0")/../control-center"

if [ ! -f "server.js" ]; then
    echo "❌ Error: Control Center server.js not found!"
    echo "💡 Make sure you're in the right directory"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✅ Starting Control Center API server..."
node server.js