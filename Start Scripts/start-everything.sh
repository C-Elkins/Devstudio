#!/bin/bash

# 🚀 Start Everything - Complete Development Environment
# This script starts all services in the correct order

echo "🚀 Starting Complete DevStudio Environment..."
echo "============================================"
echo ""

# Function to check if port is in use
check_port() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to start service in background
start_service() {
    local script_name=$1
    local service_name=$2
    local port=$3
    
    echo "🔄 Starting $service_name..."
    
    # Check if already running
    if check_port $port; then
        echo "✅ $service_name already running on port $port"
        return 0
    fi
    
    # Start the service
    ./"$script_name" &
    local pid=$!
    
    # Wait a moment and check if it started
    sleep 3
    if check_port $port; then
        echo "✅ $service_name started successfully on port $port"
    else
        echo "❌ Failed to start $service_name on port $port"
    fi
    
    echo ""
}

# Change to the Start Scripts directory
cd "$(dirname "$0")"

echo "1️⃣ Starting Database..."
./start-database.sh
echo ""

echo "2️⃣ Starting Backend API..."
start_service "start-backend.sh" "Backend API" "5002"

echo "3️⃣ Starting Frontend..."
start_service "start-frontend.sh" "Frontend" "3000"

echo "🎉 All services started!"
echo "=================================="
echo "🌐 Frontend:        http://localhost:3000"
echo "🔧 Backend API:     http://localhost:5002"
echo "🗄️  Database:       mongodb://localhost:27017"
echo ""
echo "📱 Main App is at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"
wait