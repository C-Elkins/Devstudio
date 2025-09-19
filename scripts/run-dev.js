#!/usr/bin/env node
const { spawn } = require('child_process');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function runCommand(cmd, args, opts = {}) {
  const p = spawn(cmd, args, Object.assign({ stdio: 'inherit', shell: true, cwd: ROOT }, opts));
  p.on('exit', code => {
    if (code !== 0) {
      // do not kill other processes automatically
      console.log(`${cmd} ${args.join(' ')} exited with code ${code}`);
    }
  });
  return p;
}

async function main() {
  try {
    console.log('Running install for backend and frontend (non-blocking)...');
    // Install deps in parallel but don't block
    runCommand('npm', ['run', 'install:all']);

    // Start backend and frontend concurrently using npx concurrently (works cross-platform)
    console.log('Starting backend and frontend (concurrently)...');
    const concurrentlyCmd = `npx concurrently "npm run dev:backend" "npm run dev:frontend" --names backend,frontend --prefix "[{name}]"`;
    const proc = runCommand(concurrentlyCmd, [], { cwd: ROOT });

    // Wait a bit then open browser
    await new Promise(r => setTimeout(r, 4000));

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    console.log(`Opening ${frontendUrl} in the default browser...`);

    // Cross-platform open
    if (os.platform() === 'darwin') {
      runCommand('open', [frontendUrl]);
    } else if (os.platform() === 'win32') {
      runCommand('cmd', ['/c', 'start', '', frontendUrl]);
    } else {
      // linux/unix
      runCommand('xdg-open', [frontendUrl]);
    }

    // Keep this script running while concurrently runs by piping child's stdout
    proc.on('exit', code => {
      console.log('concurrently exited with code', code);
      process.exit(code || 0);
    });
  } catch (err) {
    console.error('Failed to start dev environment', err);
    process.exit(1);
  }
}

main();
