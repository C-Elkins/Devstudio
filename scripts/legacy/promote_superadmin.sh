#!/bin/bash
# Promote the default admin to superadmin in MongoDB (local devstudio DB)
# Usage: ./promote_superadmin.sh [username]

USERNAME=${1:-admin}

mongosh "mongodb://localhost:27017/devstudio" --eval 'db.admins.updateOne({ username: "'$USERNAME'" }, { $set: { role: "superadmin" } })'

if [ $? -eq 0 ]; then
  echo "User '$USERNAME' promoted to superadmin."
else
  echo "Failed to promote user. Check MongoDB connection and username."
fi
