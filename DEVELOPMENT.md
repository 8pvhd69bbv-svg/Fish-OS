# Fish OS current development handoff

Current application: **V1.068**. Entry: `index.html`; identical archive: `Fish_OS_V1.068.html`. Historical releases and their assets remain present.

Read AGENTS.md, OPEN_TICKETS.md and DESIGN_IMPLEMENTATION.md. The current design renderer and stylesheet implement page compositions, not merely palette changes. New routes: #water-profile, #season-recap, #pre-trip. Existing editors, account guards, upload/import/restore operations and source records are retained.

## Workflow and validation

Preview with `node scripts/preview.mjs`. Its `/__design-review` endpoint injects clearly labeled synthetic records only into a loopback response for signed-out visual checks. It is not a production route or part of the deployed HTML.

Run `node scripts/check.mjs`, `node --test --test-isolation=none scripts/test-*.mjs`, and `node scripts/audit.mjs`. Review populated layouts at confirmed viewport widths of 390px and 1440px. The current suite includes account isolation, historical restore preservation, category metadata, source-linked catches, read-only insights and delayed backup export guards.

Publication requires the complete proposed Git tree to retain all prior tracked release/recovery files. Pages source was verified as main/root with HTTPS. Update the local ignored HANDOFF.md/STATUS.md with deployment evidence after publication. Ticket closure requires owner acceptance.

## Data and feature limits

Saved values, dates and distance assumptions override artboard examples. Uploaded file contents do not automatically become structured fishing records. Personal locations, notes and ratings stay account-scoped. Shared country references are approximate geography, not visited fishing locations.

The current server master refreshes with records/file catalog changes; the browser maintains its private downloadable copy. Media bytes remain separate from record JSON. Downloaded local files are snapshots. Backup exports recheck the initiating account after asynchronous reads and stop if it changes.

Inventory includes brand suggestions, reel colors, retail/model-year/comparable fields and a labeled planning resale estimate. Automatic current-listing lookup is not implemented. Unknown storage capacity and unavailable backup history are not fabricated.

## Cleanup and continuing work

The source audit found no duplicate current asset references, missing current dependencies or assets unused by every current/historical release. Removed two conflicting cosmetic blocks, a stale duplicate release badge and the unpublished V1.067 UI candidate. Historical source archives are retained. Four redesigned pages bypass the inherited render chain; further consolidation of its 25 inline wrappers remains under FISH-014.

Actual iPhone, signed-in multi-account/multi-device and full private upload/export acceptance remain open. Synthetic browser checks do not establish those results. The local handoff and human intake instructions remain outside publication.
