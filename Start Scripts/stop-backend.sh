#!/bin/bash

# 🛑 Stop Backend API
# Port: 5002

echo "🛑 Stopping Backend API..."
echo "📍 Port: 5002"
echo "----------------------------"

# Find and kill processes on port 5002
pids=$(lsof -ti :5002)

if [ -n "$pids" ]; then
    echo "📋 Found PIDs: $pids"
    echo "🔄 Stopping processes..."
    
    # Try graceful shutdown first
    echo "$pids" | xargs kill -15 2>/dev/null
    sleep 3
    
    # Check if still running
    remaining=$(lsof -ti :5002)
    if [ -n "$remaining" ]; then
        echo "⚡ Force stopping remaining processes..."
        echo "$remaining" | xargs kill -9 2>/dev/null
    fi
    
    echo "✅ Backend API stopped successfully"
else
    echo "✅ Backend API was not running"
fi