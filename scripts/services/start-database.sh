#!/bin/bash
# Start MongoDB Database
# This starts the database service for the application

echo "🗄️  Starting MongoDB Database..."

# Check if MongoDB is already running
if pgrep mongod > /dev/null 2>&1; then
    echo "⚠️  MongoDB is already running"
    echo "   You can connect to it on the default port 27017"
    exit 0
fi

echo "   Attempting to start MongoDB..."

# Try to start MongoDB using brew services (most common on macOS)
if command -v brew > /dev/null 2>&1; then
    echo "   Using brew services..."
    if brew services start mongodb/brew/mongodb-community 2>/dev/null; then
        echo "✅ MongoDB started successfully via brew services"
        exit 0
    fi
fi

# Try to start MongoDB directly
if command -v mongod > /dev/null 2>&1; then
    echo "   Starting mongod directly..."
    if mongod --config /usr/local/etc/mongod.conf --fork 2>/dev/null; then
        echo "✅ MongoDB started successfully"
        exit 0
    fi
fi

echo "❌ Failed to start MongoDB automatically"
echo "   Please start MongoDB manually or check your installation"
echo "   Common commands:"
echo "   - brew services start mongodb/brew/mongodb-community"
echo "   - sudo mongod --config /usr/local/etc/mongod.conf --fork"