#!/bin/bash

# 🔄 Restart Everything - Complete Environment Restart

echo "🔄 Restarting Complete DevStudio Environment..."
echo "==============================================="
echo ""

echo "1️⃣ Stopping all services first..."
./stop-everything.sh

echo ""
echo "2️⃣ Starting all services..."
./start-everything.sh