#!/usr/bin/env zsh
# Convenience script to install dependencies (if needed), start backend and frontend in dev mode,
# and open the frontend in the default browser (macOS `open`).

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "Installing dependencies for backend and frontend (skip if already installed)..."
npm run install:all || true

FRONTEND_URL="http://localhost:3000"

echo "Starting backend and frontend (concurrently)..."
# Use npx concurrently so this works without a global install.
npx concurrently \
  "cd backend && npm run dev" \
  "cd frontend && npm start" \
  --names "backend,frontend" --prefix "[{name}]" &

CONCURRENT_PID=$!

echo "Waiting a few seconds for frontend to boot..."
sleep 4

echo "Opening $FRONTEND_URL in the default browser..."
open "$FRONTEND_URL" || true

echo "Dev environment started (concurrently PID: $CONCURRENT_PID)." 
echo "To stop: kill $CONCURRENT_PID or press Ctrl+C in the terminal where the script is running." 
