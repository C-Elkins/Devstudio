const express = require('express');
const router = express.Router();
const fg = require('fast-glob');
const fs = require('fs');
const path = require('path');

// GET /api/lines - returns total lines of code in the repo (excluding node_modules)
router.get('/', async (req, res) => {
  try {
    // Absolute paths to backend and frontend
    const rootDir = path.resolve(__dirname, '../..');
    const backendDir = path.join(rootDir, 'backend');
    const frontendDir = path.join(rootDir, 'frontend');
    const dirsToScan = [backendDir, frontendDir];
    const ignore = [
      '**/node_modules/**',
      '**/.git/**',
      '**/build/**',
      '**/dist/**',
      '**/.next/**',
      '**/.cache/**',
      '**/.vscode/**',
      '**/.DS_Store',
      // Binary and large file types
      '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.ico',
      '**/*.ttf', '**/*.woff', '**/*.woff2', '**/*.eot',
      '**/*.mp4', '**/*.mp3', '**/*.zip', '**/*.tar', '**/*.gz', '**/*.pdf',
      '**/*.exe', '**/*.bin', '**/*.out', '**/*.log', '**/*.sqlite', '**/*.db'
    ];
    const patterns = [
      '**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.py', '**/*.sh', '**/*.json', '**/*.css', '**/*.html',
      '**/*.md', '**/*.yml', '**/*.yaml', '**/*.env', '**/*.txt', '**/*.conf', '**/*.config', '**/*.ini', '**/*.xml'
    ];
    let total = 0;
    for (const dir of dirsToScan) {
      const files = await fg(patterns, { ignore, dot: true, cwd: dir, absolute: true });
      for (const file of files) {
        try {
          const stat = fs.statSync(file);
          // Skip files larger than 1MB to avoid heavy CPU usage
          if (stat.size > 1024 * 1024) continue;
          const content = fs.readFileSync(file, 'utf8');
          total += content.split('\n').length;
        } catch (e) {
          // skip unreadable files
        }
      }
    }
    res.json({ lines: total });
  } catch (err) {
    console.error('Line count error:', err);
    res.status(500).json({ error: 'Failed to count lines', details: err.message });
  }
});

module.exports = router;
