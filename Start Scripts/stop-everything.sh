#!/bin/bash

# 🛑 Stop All Services - Complete Environment Shutdown

echo "🛑 Stopping All DevStudio Services..."
echo "====================================="
echo ""

# Function to stop process on port
stop_port() {
    local port=$1
    local service_name=$2
    
    echo "🔄 Stopping $service_name on port $port..."
    
    # Find and kill processes on the port
    local pids=$(lsof -ti :$port)
    
    if [ -n "$pids" ]; then
        echo "   Found PIDs: $pids"
        echo "$pids" | xargs kill -15 2>/dev/null
        sleep 2
        
        # Check if still running, force kill if needed
        local remaining=$(lsof -ti :$port)
        if [ -n "$remaining" ]; then
            echo "   Force stopping remaining processes..."
            echo "$remaining" | xargs kill -9 2>/dev/null
        fi
        
        echo "✅ $service_name stopped"
    else
        echo "✅ $service_name was not running"
    fi
    echo ""
}

# Function to stop by process name
stop_process() {
    local process_name=$1
    local service_name=$2
    
    echo "🔄 Stopping $service_name..."
    
    local pids=$(pgrep -f "$process_name")
    
    if [ -n "$pids" ]; then
        echo "   Found PIDs: $pids"
        echo "$pids" | xargs kill -15 2>/dev/null
        sleep 2
        
        # Check if still running, force kill if needed
        local remaining=$(pgrep -f "$process_name")
        if [ -n "$remaining" ]; then
            echo "   Force stopping remaining processes..."
            echo "$remaining" | xargs kill -9 2>/dev/null
        fi
        
        echo "✅ $service_name stopped"
    else
        echo "✅ $service_name was not running"
    fi
    echo ""
}

# Stop all services
stop_port "5173" "Control Center GUI"
stop_port "3001" "Control Center API"
stop_port "3000" "Frontend React App"
stop_port "5002" "Backend API"

# Stop MongoDB (optional - you might want to keep it running)
read -p "🤔 Stop MongoDB database? (y/N): " stop_mongo
if [[ $stop_mongo =~ ^[Yy]$ ]]; then
    if command -v brew >/dev/null 2>&1; then
        echo "🔄 Stopping MongoDB with brew services..."
        brew services stop mongodb/brew/mongodb-community
    else
        stop_process "mongod" "MongoDB"
    fi
fi

echo "🎉 All services stopped!"
echo "======================="
echo "💡 To start services again:"
echo "   ./start-everything.sh     # Start all services"
echo "   ./start-[service].sh      # Start individual service"