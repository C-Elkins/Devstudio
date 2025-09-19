#!/bin/bash

# 🚀 Start Backend API
# Port: 5002

echo "🚀 Starting Backend API..."
echo "📍 Port: 5002"
echo "🌐 URL: http://localhost:5002"
echo "----------------------------------------"

cd "$(dirname "$0")/../backend"

if [ ! -f "server.js" ]; then
    echo "❌ Error: Backend server.js not found!"
    echo "💡 Make sure you're in the right directory"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✅ Starting backend server..."
npm run dev