#!/usr/bin/env bash
set -euo pipefail

# Launch Control Center GUI (dev only). If control-center is missing, exit gracefully.
if [ ! -d "control-center" ]; then
  echo "ℹ️  Control Center is not present (control-center/ missing). Skipping launch." >&2
  exit 0
fi

cd control-center
if [ ! -f package.json ]; then
  echo "❌ package.json not found in control-center/." >&2
  exit 1
fi

npm run dev
