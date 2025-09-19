#!/bin/bash

# 🔄 Restart Control Center API

echo "🔄 Restarting Control Center API..."
echo "===================================="

./stop-api.sh
echo ""
./start-api.sh