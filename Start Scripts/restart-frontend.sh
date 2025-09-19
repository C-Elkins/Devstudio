#!/bin/bash

# 🔄 Restart Frontend Service

echo "🔄 Restarting Frontend..."
echo "========================="

./stop-frontend.sh
echo ""
./start-frontend.sh