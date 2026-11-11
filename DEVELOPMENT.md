# Fish OS V1.0795 — follow-up fixes

November 10, 2026 (Pacific). Owner acceptance remains pending.

- ADD A RIVER / USGS STATION has no Show in panel selector. ADD TO ALL STATION LISTS adds the station to the shared catalog without changing any selected panel. Catalog restoration, deduplication and account guards are covered.
- Trips and Journal retain whole-card mouse and keyboard activation with independent nested controls. Browser checks open both through card titles. Current design, species and river scripts use new release filenames to avoid reuse of older cached scripts.
- Species renaming preserves case-insensitive caught status, removed status and access to previous-name notes. Original alias evidence remains retained.
- FISH-014 removes the redundant release-marking wrapper; shared dispatcher retains startup/delayed marking. 25 legacy inline wrappers remain.
- In-app tickets include FISH-086–089. Previously accepted FISH-032/058 move to history under the existing retention policy; no pending ticket is closed.

Verification: 203 Node tests pass with --test-isolation=none; 77 scripts parse; dependency audit has no failures. Current HTML and Fish_OS_V1.0795.html match. Signed-out synthetic browser checks verify trip and journal title clicks and river controls. Live account photo persistence, actual iOS and second-account verification remain outstanding. No production private records or schema changed. Deployment results are recorded in local STATUS.md and HANDOFF.md.
