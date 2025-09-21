#!/usr/bin/env bash
set -euo pipefail

# Install Control Center deps only if directory exists.
if [ ! -d "control-center" ]; then
  echo "ℹ️  Control Center not found; nothing to install." >&2
  exit 0
fi

cd control-center
npm install
