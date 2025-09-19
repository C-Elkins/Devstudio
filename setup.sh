#!/bin/bash

echo "🚀 Setting up DevStudio Full-Stack Project..."

# Create frontend structure if it doesn't exist
if [ ! -d "frontend" ]; then
    echo "📁 Creating frontend directory structure..."
    mkdir -p frontend/src/components
    mkdir -p frontend/public
fi

# Create backend structure if it doesn't exist
if [ ! -d "backend" ]; then
    echo "📁 Creating backend directory structure..."
    mkdir -p backend/routes
    mkdir -p backend/models
    mkdir -p backend/config
    mkdir -p backend/middleware
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo "✅ Setup complete!"
echo ""
echo "🔧 To start the project:"
echo "1. Start MongoDB: mongod"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start frontend: cd frontend && npm start"
echo ""
echo "🌐 Frontend will be available at: http://localhost:3000"
echo "🔗 Backend API will be available at: http://localhost:5000"
echo ""
echo "👤 Admin login credentials:"
echo "   Username: admin"
echo "   Password: admin123"