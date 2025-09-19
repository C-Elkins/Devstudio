#!/bin/bash
# Quick Setup Script for DevStudio Portfolio

echo "🚀 DevStudio Portfolio Setup"
echo "============================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

echo "📦 Installing dependencies..."

# Install root dependencies
echo "   Installing root dependencies..."
npm install

# Install control-center dependencies
if [ -d "control-center" ]; then
    echo "   Installing Control Center dependencies..."
    cd control-center && npm install && cd ..
else
    echo "⚠️  Control Center directory not found"
fi

# Install backend dependencies  
if [ -d "backend" ]; then
    echo "   Installing Backend dependencies..."
    cd backend && npm install && cd ..
else
    echo "⚠️  Backend directory not found"
fi

# Install frontend dependencies
if [ -d "frontend" ]; then
    echo "   Installing Frontend dependencies..."
    cd frontend && npm install && cd ..
else
    echo "⚠️  Frontend directory not found"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Start all services: ./scripts/services/start-all.sh"
echo "2. Open Control Center: http://localhost:5173"
echo "3. Check the README-NEW.md for full documentation"