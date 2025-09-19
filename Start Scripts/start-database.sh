#!/bin/bash

# 🚀 Start Database (MongoDB)

echo "🚀 Starting MongoDB..."
echo "📍 Default Port: 27017"
echo "----------------------------------------"

# Check if MongoDB is already running
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is already running!"
    echo "💡 Connection: mongodb://localhost:27017"
    exit 0
fi

# Try to start MongoDB using brew services (most common on macOS)
if command -v brew >/dev/null 2>&1; then
    echo "📦 Starting MongoDB with brew services..."
    brew services start mongodb/brew/mongodb-community
    
    # Wait a moment for startup
    sleep 3
    
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB started successfully!"
        echo "💡 Connection: mongodb://localhost:27017"
        exit 0
    fi
fi

# Fallback: try starting mongod directly
if command -v mongod >/dev/null 2>&1; then
    echo "📦 Starting MongoDB directly..."
    mongod --dbpath /usr/local/var/mongodb --logpath /usr/local/var/log/mongodb/mongo.log --fork
    
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB started successfully!"
        echo "💡 Connection: mongodb://localhost:27017"
        exit 0
    fi
fi

echo "❌ Error: Could not start MongoDB"
echo "💡 Make sure MongoDB is installed:"
echo "   brew install mongodb/brew/mongodb-community"
echo "   or check your MongoDB installation"
exit 1