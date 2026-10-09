# Fish OS working rules

- Preserve the existing HTML app and design. Make focused changes; no framework migration without an agreed reason.
- This folder is the repository. Never serve or stage the parent workspace.
- Private inputs remain in D:\Fish OS\Private Data, outside Git and preview. Never commit real records, exports, credentials, or sensitive backups.
- Never print secret values. Publishable/legacy anon keys differ from privileged secret/service-role keys.
- Preview: node scripts/preview.mjs. Check: node scripts/check.mjs.
- Use a fresh signed-out browser and synthetic data. Preview HTML can connect to production; do not sign in or run production write tests during setup.
- Read OPEN_TICKETS.md for current priorities. If local STATUS.md exists, read it before changing import, auth, hydration, or sync. Check cache ownership and logout behavior.
- Use the Supabase skill for backend work. No production schema, policy, or data changes without task authorization.
- Review diffs and staged paths before commits. Secret-pattern scans do not guarantee privacy.
- Push/deploy when requested, verify Pages source first, then live behavior. Publish index.html and an identical versioned HTML archive; preserve earlier archives.
- Keep documentation current and distinguish facts from assumptions.
- Preserve existing functions and estimates unless the user approves their removal. Keep recorded fishing distance separate from travel distance and labeled assumptions.
- Identify requested changes by page reference and exact control name. Close tickets only on user acceptance; a privately checked review box is input for the next ledger update.
- Keep completed-trip packing read-only; create independent named copies for future trips.
- Compare the complete proposed Git tree with the current main tree before publication so earlier assets and recovery scripts remain present.
- Maintain one current public DEVELOPMENT.md and current local HANDOFF.md/STATUS.md. Avoid full duplicate backups for code-only releases; capture records before authorized live data changes.
