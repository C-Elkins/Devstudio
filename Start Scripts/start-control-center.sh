#!/bin/bash

# 🚀 Start Control Center GUI (Web Interface)
# Port: 5173

echo "🚀 Starting Control Center GUI..."
echo "📍 Port: 5173"
echo "🌐 URL: http://localhost:5173"
echo "----------------------------------------"

cd "$(dirname "$0")/../control-center"

if [ ! -f "package.json" ]; then
    echo "❌ Error: Control Center package.json not found!"
    echo "💡 Make sure you're in the right directory"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✅ Starting Control Center GUI..."
npm run dev