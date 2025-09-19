#!/bin/bash

# 🛑 Stop Control Center API
# Port: 3001

echo "🛑 Stopping Control Center API..."
echo "📍 Port: 3001"
echo "---------------------------------"

# Find and kill processes on port 3001
pids=$(lsof -ti :3001)

if [ -n "$pids" ]; then
    echo "📋 Found PIDs: $pids"
    echo "🔄 Stopping processes..."
    
    # Try graceful shutdown first
    echo "$pids" | xargs kill -15 2>/dev/null
    sleep 3
    
    # Check if still running
    remaining=$(lsof -ti :3001)
    if [ -n "$remaining" ]; then
        echo "⚡ Force stopping remaining processes..."
        echo "$remaining" | xargs kill -9 2>/dev/null
    fi
    
    echo "✅ Control Center API stopped successfully"
else
    echo "✅ Control Center API was not running"
fi