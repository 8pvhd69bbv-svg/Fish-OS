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

## Efficient delegated work

- When the user authorizes delegation, reuse named agents with focused briefs. Include the goal, relevant file paths, constraints and acceptance checks; avoid inheriting the full chat when a short brief suffices.
- Planner reads only enough to identify dependencies, risks and bounded tasks. Grunt implements a bounded task with explicit file ownership. Avoid overlapping edits and repeated repository-wide audits.
- Agent reports should list changes, checks, unresolved issues and relevant paths concisely. The orchestrator integrates once, runs the appropriate final checks, maintains the handoff and publishes.
- Keep private account reads/writes, credentials, data reconciliation and final publication under the orchestrator's control. Do not distribute private records unless a delegated task requires them.
- Delegation is not guaranteed to reduce tokens. Use one agent or direct work for small changes; use parallel agents only for independent work that benefits from it. Never silently substitute an unavailable requested model.
