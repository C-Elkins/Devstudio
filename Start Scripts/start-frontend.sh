#!/bin/bash

# 🚀 Start Frontend (React App)
# Port: 3000

echo "🚀 Starting Frontend..."
echo "📍 Port: 3000"
echo "🌐 URL: http://localhost:3000"
echo "----------------------------------------"

cd "$(dirname "$0")/../frontend"

if [ ! -f "package.json" ]; then
    echo "❌ Error: Frontend not found!"
    echo "💡 Make sure you're in the right directory"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✅ Starting frontend server..."
npm start