#!/bin/bash
# Launch the DevStudio Electron GUI from the root directory
cd "$(dirname "$0")/apps/devstudio-electron/devstudio-electron"
npm install --no-audit --no-fund
npm start
