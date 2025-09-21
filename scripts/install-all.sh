#!/usr/bin/env bash
set -euo pipefail

# Install backend and frontend always
( cd backend && npm install )
( cd frontend && npm install )

# Control Center is optional; install only if present
if [ -d "control-center" ]; then
  ( cd control-center && npm install )
else
  echo "ℹ️  Skipping control-center install (folder missing)."
fi
