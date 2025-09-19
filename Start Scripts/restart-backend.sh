#!/bin/bash

# 🔄 Restart Backend API

echo "🔄 Restarting Backend API..."
echo "============================"

./stop-backend.sh
echo ""
./start-backend.sh