#!/usr/bin/env zsh
# Simple wrapper to invoke the cross-platform Node runner. This keeps the original
# script name usable while delegating cross-platform logic to scripts/run-dev.js.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if command -v node >/dev/null 2>&1; then
  echo "Delegating to node runner (scripts/run-dev.js)..."
  node ./scripts/run-dev.js
else
  echo "Node is required to run the cross-platform dev runner. Please install Node.js."
  exit 1
fi
