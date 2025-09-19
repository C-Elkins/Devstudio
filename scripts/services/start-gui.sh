#!/bin/bash
# Start the Control Center GUI (React frontend)
# This provides the web interface for managing services

echo "🎨 Starting Control Center GUI..."

cd "$(dirname "$0")/../../control-center"

if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found in control-center directory"
    echo "   Make sure you're running from the project root"
    exit 1
fi

if lsof -i :5173 > /dev/null 2>&1; then
    echo "⚠️  GUI already running on port 5173"
    echo "   Visit: http://localhost:5173"
else
    echo "   Starting on http://localhost:5173"
    npm run dev
fi