#!/bin/bash

# 🛑 Stop Control Center GUI
# Port: 5173

echo "🛑 Stopping Control Center GUI..."
echo "📍 Port: 5173"
echo "---------------------------------"

# Find and kill processes on port 5173
pids=$(lsof -ti :5173)

if [ -n "$pids" ]; then
    echo "📋 Found PIDs: $pids"
    echo "🔄 Stopping processes..."
    
    # Try graceful shutdown first
    echo "$pids" | xargs kill -15 2>/dev/null
    sleep 3
    
    # Check if still running
    remaining=$(lsof -ti :5173)
    if [ -n "$remaining" ]; then
        echo "⚡ Force stopping remaining processes..."
        echo "$remaining" | xargs kill -9 2>/dev/null
    fi
    
    echo "✅ Control Center GUI stopped successfully"
else
    echo "✅ Control Center GUI was not running"
fi