# Removing Control Center (pre-release)

This project treats `control-center/` as a development-only tool. Before releasing:

1. Delete the folder:
   - `git rm -r control-center` (or remove it locally and commit)
2. Update scripts (already resilient):
   - Root `npm run gui`, `gui:install`, and `install:all` safely no-op if the folder is missing.
3. Clean docs and start scripts (optional polish):
   - In README and Start Scripts README, remove references to Control Center.
4. Verify CI:
   - The workflow `.github/workflows/block-control-center.yml` will fail if `control-center/` remains on main or release tags.
5. Sanity check ports:
   - Ensure nothing else expects port 3001.

Notes

- The Control Center API exits automatically in production and binds to 127.0.0.1 in development.
- Frontend and backend do not import from Control Center; removing it won’t break app runtime.
