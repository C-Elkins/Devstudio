#!/bin/bash
# Start All Services
# This starts the complete development environment

echo "🚀 Starting Complete Development Environment..."
echo "=================================="

# Function to start service in background
start_service() {
    local script_name="$1"
    local service_name="$2"
    
    echo "Starting $service_name..."
    if bash "$(dirname "$0")/$script_name" &
    then
        echo "✅ $service_name started"
    else
        echo "❌ Failed to start $service_name"
    fi
}

# Start database first
echo "1️⃣  Starting Database..."
bash "$(dirname "$0")/start-database.sh"

sleep 2

# Start backend
echo ""
echo "2️⃣  Starting Backend API..."
start_service "start-backend.sh" "Backend API"

sleep 2

# Start frontend
echo ""
echo "3️⃣  Starting Frontend App..."
start_service "start-frontend.sh" "Frontend App"

sleep 2

# Start Control Center API
echo ""
echo "4️⃣  Starting Control Center API..."
start_service "start-api.sh" "Control Center API"

sleep 2

# Start Control Center GUI
echo ""
echo "5️⃣  Starting Control Center GUI..."
start_service "start-gui.sh" "Control Center GUI"

echo ""
echo "🎉 All services started!"
echo "=================================="
echo "📱 Control Center: http://localhost:5173"
echo "🌐 Frontend App:   http://localhost:3000"
echo "⚙️  Backend API:    http://localhost:5002"
echo "🛠️  API Server:     http://localhost:3001"
echo ""
echo "Use the Control Center to manage all services from one place!"