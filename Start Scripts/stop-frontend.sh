#!/bin/bash

# 🛑 Stop Frontend Service
# Port: 3000

echo "🛑 Stopping Frontend..."
echo "📍 Port: 3000"
echo "------------------------"

# Find and kill processes on port 3000
pids=$(lsof -ti :3000)

if [ -n "$pids" ]; then
    echo "📋 Found PIDs: $pids"
    echo "🔄 Stopping processes..."
    
    # Try graceful shutdown first
    echo "$pids" | xargs kill -15 2>/dev/null
    sleep 3
    
    # Check if still running
    remaining=$(lsof -ti :3000)
    if [ -n "$remaining" ]; then
        echo "⚡ Force stopping remaining processes..."
        echo "$remaining" | xargs kill -9 2>/dev/null
    fi
    
    echo "✅ Frontend stopped successfully"
else
    echo "✅ Frontend was not running"
fi