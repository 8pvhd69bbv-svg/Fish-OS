# FISH OS — Project State

Last documentation update: 2026-10-25 (Pacific time). This is the first-read handoff for new development chats. See DEVELOPMENT.md for current verification and limits.

## Current state
- **Release:** V1.073 (maintenance update; ticket acceptance remains separate).
- **GitHub:** https://github.com/8pvhd69bbv-svg/Fish-OS — default branch `main`.
- **Live app:** https://8pvhd69bbv-svg.github.io/Fish-OS/
- **Entry files:** `index.html` and `Fish_OS_V1.073.html`, documented as identical.
- **Last reported tests:** 149 synthetic regressions passing, syntax/static-asset checks and signed-out Upload browser check (see `DEVELOPMENT.md`).
- **Owner acceptance:** No additional tickets accepted in V1.073.

## Source of truth
- **GitHub:** public application code, designs, and development documentation.
- **Supabase:** authoritative authenticated private application data, uploads and account-scoped persistence. Do not put private records, credentials or service-role keys in GitHub.
- **This file:** concise handoff, known risks, and development guardrails.
- **OPEN_TICKETS.md:** detailed active ticket status; **TICKET_HISTORY.md:** archived/accepted history.
- **DEVELOPMENT.md:** current release-specific implementation notes and evidence.
- **DESIGN_IMPLEMENTATION.md:** current composition assets and UI verification requirements.
- **HOSTING.md:** portability and deployment runbook.

## Architecture and design
HTML/CSS/JavaScript front end on GitHub Pages with Leaflet mapping and Supabase Auth, database and private Storage. Current shared UI assets documented in the repository:
- `assets/fishos-design-v1-0725.js`
- `assets/fishos-design-models-v1-068.js`
- `assets/fishos-ui-v1-068.css`

The Oct 25 backend review verified four application tables with RLS/ownership policies, private media Storage, master/revision triggers and matching current snapshots. **Reinspect the actual schema, policies and data before backend changes.** Added and verified the file-owner index; no private records or ownership policies changed.

## Current ticket snapshot (not a substitute for OPEN_TICKETS.md)
**Accepted:** FISH-058 (gear/pack health) and FISH-032 (release backups), accepted V1.071; retain through V1.074 per established ticket policy.

**Requires attention:**
- FISH-030: second-account sign-in, upload and isolation test; requires tester.
- FISH-014: incremental legacy renderer consolidation (26 inherited wrappers remain in the current static audit).
- FISH-005: alternate-host authentication verification.
- FISH-009: verified private research integration (blocked pending source verification).
- FISH-034: integrated media library.
- FISH-067: fly recipes/material availability.
- FISH-036: warranty wizard.
- FISH-038: installable PWA.
- FISH-037: friend-code sharing/messaging with permissions.
- FISH-039: Stillwater collection/breeding/growth.

**Other ongoing or awaiting acceptance:** FISH-011, 013, 015, 017, 021, 024, 025, 026, 029, 033, 035, 056, 063, 066, and 078–085. For precise implementation status, see `OPEN_TICKETS.md`; some are implemented or synthetically verified but **not owner-accepted**. Automatic market-listing valuations remain unfinished (FISH-082).

**Removed:** FISH-040 must not be reinstated as another game; Stillwater work is FISH-039.

**Documented priority order:** FISH-030 when a tester is available; FISH-014; FISH-005; FISH-009; FISH-034; FISH-067; FISH-036; FISH-038; FISH-037; FISH-039.

## Known verification gaps and risks
- Live two-account tests and live photo/upload persistence checks are outstanding.
- Alternate-host login is not verified.
- Supabase advisor confirmed on Oct 25 that leaked-password protection remains disabled.
- Legacy renderer wrappers remain; wholesale removal risks breaking editors, account, backups/import and trips.
- Resource categorization needs persistent manual control and verification; some geographical sources and pins are uncertain.
- A source reference, estimate or planned trip is not a confirmed catch, visit, or precise fishing coordinate.

## Non-negotiable development rules
1. Preserve existing functionality and data; make targeted changes, check regressions, and do not casually refactor legacy code.
2. Keep compact early-2000s/LimeWire-style information density, responsive behavior and existing navigation; do not introduce emoji UI icons.
3. Never invent catches, coordinates, research provenance, prices or backup timestamps; distinguish estimated from confirmed information.
4. Respect authentication, RLS, owner isolation, private Storage and backup/restore paths. Do not alter production data/schema without an explicit scoped task and suitable safeguards.
5. Retain oldest + ten preceding + current versioned HTML releases, as documented.
6. Only **owner acceptance** closes a ticket. Keep implemented, tested, awaiting review and accepted distinct.
7. Do not promote a partial release to a full Update without owner direction.

## Development workflow
1. Read `PROJECT_STATE.md`, `OPEN_TICKETS.md` and `DEVELOPMENT.md`; inspect relevant current code before edits.
2. Check connected Supabase state when backend work requires it; never rely on stale descriptions.
3. Implement scoped changes, update `index.html` and matching versioned release as appropriate.
4. Run `node scripts/check.mjs`, `node --test --test-isolation=none scripts/test-*.mjs`; run `node scripts/audit.mjs` and `node scripts/preview.mjs`/browser checks when relevant.
5. Report actual tests and unverifiable conditions; never claim live or owner approval from synthetic tests.
6. Commit documentation alongside code: update ticket statuses in `OPEN_TICKETS.md`, release detail in `DEVELOPMENT.md`, and current snapshot/decisions here.

## Important decisions
- GitHub contains public source; Supabase remains private data authority.
- This one file is the **first-read handoff**. Detailed ledgers remain linked rather than duplicated.
- Preserve existing editors/auth/import/backup logic during incremental UI consolidation.
- Version archive retention: oldest + ten previous + current.
- All Stillwater work belongs under FISH-039.

## Changelog
- **2026-10-25:** V1.073 library deletion safety, file-owner database index, ticket refresh and verified private intake receipt. Existing HTML archives preserved; 14 retained, above the minimum target.
- **2026-10-24:** Established central project state documentation and README separation. Documentation-only change; no new application features or tests claimed.
