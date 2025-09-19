#!/bin/bash
# Start frontend, backend, and MongoDB (if installed locally) with a simple menu
# Usage: ./devstudio_gui.sh

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Start MongoDB if installed
start_mongo() {
  if command_exists mongod; then
    echo "Starting MongoDB..."
    mongod --dbpath ./mongodb-data --bind_ip 127.0.0.1 --port 27017 &
    sleep 2
  else
    echo "MongoDB not found. Please start your database manually if needed."
  fi
}

# Start backend
start_backend() {
  echo "Starting backend..."
  cd backend && npm install && npm run dev &
  cd ..
}

# Start frontend
start_frontend() {
  echo "Starting frontend..."
  cd frontend && npm install && npm run dev &
  cd ..
}

# Main menu
while true; do
  echo "\nDevStudio Project Launcher"
  echo "1) Start MongoDB (local only)"
  echo "2) Start Backend"
  echo "3) Start Frontend"
  echo "4) Start All"
  echo "5) Promote Admin to Superadmin"
  echo "6) Exit"
  read -p "Choose an option: " opt
  case $opt in
    1) start_mongo ;;
    2) start_backend ;;
    3) start_frontend ;;
    4) start_mongo; start_backend; start_frontend ;;
    5) read -p "Enter admin username [admin]: " user; ./promote_superadmin.sh ${user:-admin} ;;
    6) echo "Goodbye!"; exit 0 ;;
    *) echo "Invalid option" ;;
  esac
done
