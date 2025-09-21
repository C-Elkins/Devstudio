# Control Center (Development Only)

Important: This Control Center is strictly for local development.


- The API server binds to 127.0.0.1 only and rejects non-local origins.
- It exits immediately if NODE_ENV=production.
- CI will fail pushes/tags to production branches when the control-center/ directory exists.

Local usage

- Start GUI: from repo root run `npm run gui`
- Start API: run the start script in Start Scripts or `node server.js` from this folder

Do not deploy this app. Remove this entire folder before release. See ../../docs/REMOVE-CONTROL-CENTER.md.
