# Fish OS current development handoff

Current release: **V1.070**. Stillwater playable game candidate; deployment verification pending. Entry: `index.html`; identical release archive: `Fish_OS_V1.070.html`. Historical releases and their assets remain present.

Read AGENTS.md, OPEN_TICKETS.md and DESIGN_IMPLEMENTATION.md. The current design renderer and stylesheet implement page compositions, not merely palette changes. New routes: #water-profile, #season-recap, #pre-trip. Existing editors, account guards, upload/import/restore operations and source records are retained.

## Workflow and validation

Preview with `node scripts/preview.mjs`. Its `/__design-review` endpoint injects clearly labeled synthetic records only into a loopback response for signed-out visual checks. It is not a production route or part of the deployed HTML.

Run `node scripts/check.mjs`, `node --test --test-isolation=none scripts/test-*.mjs`, and `node scripts/audit.mjs`. Review populated layouts at confirmed viewport widths of 390px and 1440px. The current suite includes account isolation, historical restore preservation, category metadata, source-linked catches, read-only insights and delayed backup export guards.

Updates are committed and pushed by default unless the user explicitly instructs otherwise. Publication requires the complete proposed Git tree to retain all prior tracked release/recovery files. Pages source was verified as main/root with HTTPS. Update the local ignored HANDOFF.md/STATUS.md with deployment evidence after publication. Ticket closure requires owner acceptance.

## Data and feature limits

Saved values, dates and distance assumptions override artboard examples. Uploaded file contents do not automatically become structured fishing records. Personal locations, notes and ratings stay account-scoped. Shared country references are approximate geography, not visited fishing locations.

The current server master refreshes with records/file catalog changes; the browser maintains its private downloadable copy. Media bytes remain separate from record JSON. Downloaded local files are snapshots. Backup exports recheck the initiating account after asynchronous reads and stop if it changes.

Inventory includes brand suggestions, reel colors, retail/model-year/comparable fields and a labeled planning resale estimate. Automatic current-listing lookup is not implemented. Unknown storage capacity and unavailable backup history are not fabricated.

## Cleanup and continuing work

The source audit found no duplicate current asset references, missing current dependencies or assets unused by every current/historical release. Removed two conflicting cosmetic blocks, a stale duplicate release badge and the unpublished V1.067 UI candidate. Historical source archives are retained. Four redesigned pages bypass the inherited render chain; further consolidation of its 25 inline wrappers remains under FISH-014.

Actual iPhone, signed-in multi-account/multi-device and full private upload/export acceptance remain open. Synthetic browser checks do not establish those results. The local handoff and human intake instructions remain outside publication.

## V1.069 review fixes

Search omits resource/link collections before result limits. River flow panels are visible below the home map; popup names display once and Leaflet stacking is isolated. Journal actions align right, month names and species tags derive from saved entries, and locations sort alphabetically. Journal rows are not hidden or grouped: owner-authorized duplicate removal was applied to private cloud records with a verified recovery copy; no private records are published. Current tickets retire accepted items to TICKET_HISTORY.md after three updates; routine session checks replace FISH-012. AGENTS.md persists delegation for new project chats. New focused override assets: fishos-review-v1-069.js/.css and fishos-tickets-v1-069.js.

## V1.070 Stillwater

Stillwater is an original playable adventure contained in a fixed game viewport on the existing #fishing-game route. Standalone assets/stillwater-game.html, CSS and JS own all game screens. The prior concept and click-target prototype are replaced on this route. Existing private app records remain untouched.

Day: ten minutes of active daylight, wading/aiming, riffle/pool/deep-run fish, fly/depth matching, drag/mending, timed hook set and directional tension fights. A full creel, exhausted energy or sunset returns to the lodge. Optional hatch, wind and rescue events occur during the day. Three river sections unlock through catches. The provided animated brown trout sheet is copied into public assets/stillwater-brown-trout.png and used in-water and in catch/collection views.

Night: five customers, cooking timers, patience, tips and one-to-three lodge stars. A post-service shop upgrades rods, fly patterns, dishes, creel and kitchen before sleeping. Soup permits recovery after a poor fishing day. Species cards start as silhouettes and track size/best-fly records. Season milestones cover the Copper King legendary brown, full menu and three catches in every section.

Persistence uses only the browser-local fishos-stillwater-adventure-v2 namespace; it is not cloud-synced or account-specific. Expedition inventory, progression and in-progress dinner service survive reloads. No production/account data is accessed. This is a three-species prototype, not a full commercial game; breeding/growth and the separate target-game backlog remain open.

Validation: 70 tests pass, including targeted bites, wrong-fly rejection, fights, quest idempotence, service earnings/stars, pause, reload, ten-minute daylight/events and upgrade gates. Syntax/dependency audit passes. Signed-out 390px/1440px browser checks cover embedded layout, locked collection and a cooked/served dinner order. Real-device touch and extended balance testing remain pending.
