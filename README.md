# Fish OS — FLYS FOR FISH

Fish OS is a fishing operating system for trips, locations, fish journals, tracking, rod/reel/line inventories, fly patterns, tying materials, packing, maps, research, and personal records.

## Live website
https://8pvhd69bbv-svg.github.io/Fish-OS/

## Current release
**V49** — subtle slate-blue and fern-green accents. Earlier V45–V48 changes to search, dashboard, map pins, packing, and Resources still require authenticated browser verification. A successful GitHub Pages build alone does not verify UI functionality.

- `index.html` is the **active website** served by GitHub Pages.
- `Fish_OS_V49.html` is the identical historical release copy; older `Fish_OS_V*.html` files are backups, not the home page.
- `.nojekyll` should be retained.
- `OPEN_TICKETS.md` is the authoritative open-ticket list. **Only the user closes tickets.**
- `Fish_OS_Codex_Handoff.md` (if available locally) describes earlier architecture; use this README and open tickets for newer release status.

## Architecture and privacy
- GitHub Pages hosts application code and public assets **only**.
- Supabase handles authenticated private records, including `public.fishos_user_data`, private file metadata and `fishos-private` storage.
- Enforce row-level security (RLS); never expose service-role keys in browser code.
- **Never commit or publish** private master backups, location exports, trip/journal data, account profiles, personal photos, authentication secrets or private links.
- Local Windows Media-drive folders are **not automatically synchronized** by these GitHub updates.
- A complete authoritative private master requires authenticated Supabase export and reconciliation with local private files; do not assume code repository files are the full dataset.

## Change and release rules
1. Preserve existing features, UI, mobile compatibility and the retro LimeWire / early-2000s file-browser design.
2. Change only user-requested features; flag unavoidable incidental changes before release.
3. Read `OPEN_TICKETS.md` before work, document changes and verification outcomes, and keep unverified tasks open.
4. Save each tested release as both `index.html` and an identical `Fish_OS_VNN.html` copy.
5. Distinguish actual observations from estimates; never invent fish records, coordinates, conditions, distances, or weights.
6. Verify in an authenticated live browser; browser JavaScript render overrides have caused features not to appear even when deployment succeeded.

## Current development concerns
- Home dashboard metrics and V8-style arrangement still need user confirmation.
- Packing custom baseline weights and prominent ounce/pound totals still need user confirmation.
- Location map markers and distinct saved coordinate count need validation.
- Resources labels (Fly Shop / Regulations / Research) are inferred for display and may need classification review.
- Private master consolidation, persistence testing and local-drive backup remain open.

See [OPEN_TICKETS.md](OPEN_TICKETS.md) for ticket IDs and acceptance criteria.
