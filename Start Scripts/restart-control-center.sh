#!/bin/bash

# 🔄 Restart Control Center GUI

echo "🔄 Restarting Control Center GUI..."
echo "===================================="

./stop-control-center.sh
echo ""
./start-control-center.sh