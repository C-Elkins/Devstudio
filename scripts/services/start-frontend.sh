#!/bin/bash
# Start the Frontend Application
# This provides the main user-facing web application

echo "🌐 Starting Frontend Application..."

cd "$(dirname "$0")/../../frontend"

if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found in frontend directory"
    echo "   Make sure you're running from the project root"
    exit 1
fi

if lsof -i :3000 > /dev/null 2>&1; then
    echo "⚠️  Frontend already running on port 3000"
    echo "   Visit: http://localhost:3000"
else
    echo "   Starting on http://localhost:3000"
    npm start
fi