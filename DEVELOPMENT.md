# Fish OS V1.079 — workspace refinements

November 7, 2026 (Pacific). Implements the fourteen requested interface refinements; owner acceptance remains pending.

- Trips are grouped by location, with most-trips-first (alphabetical ties) and Location A–Z sorting. Whole cards open trips; Delete confirms and removes only the trip and its checklist, preserving journals, catches, photos and locations. Shared-ID checklists survive while another trip uses them.
- Journal cards open their entry editor. Gear Health cards navigate to Inventory and open the exact item; legacy items outside the unified editor show their saved details. Assess remains independent.
- Location, fly and knot thumbnails have drag/slider framing, five aspect ratios and saved crop settings. The original photo stays intact. Section cover photos retain their existing controls.
- River search adds stations to every panel dropdown without the redundant panel selector or changing current panel selections. Dashboard activity/workspace tools stay expanded.
- Removed the duplicated yellow map notice and the Private uploaded research panel from Research. Uploaded files remain in the private library.
- Species Tracker replaces Fish Tracker. One Add / Manage Species control supports adding, renaming, removing and restoring. Salmon aliases share one card and retain all source names/notes; original private records and catch evidence are preserved. Caught state matching is case-insensitive and existing lock preferences remain respected.
- Desktop sidebar uses consistently sized vector icons; mobile keeps its artwork.
- Knot pages support editing/clearing information, adding knots, removing saved notes/custom knots, and private photo attachments. Removing a knot does not delete library files; file-deletion guards recognize knot attachments.

Verification: 193 Node tests pass with --test-isolation=none, including account isolation, scoped storage, deletion, crop metadata, stale editors and knot persistence; species suite also executes its direct assertions. All 78 referenced/inline scripts parse. Dependency audit reports no failures. index.html and Fish_OS_V1.079.html match byte for byte. Signed-out synthetic browser checks verified grouped trip navigation, exact gear item navigation, species alias namecards/removal and preserved caught totals, dashboard controls, and desktop/mobile knot layout. Live account photo upload/save and actual iOS remain unverified; no production records or schema were edited.

GitHub Pages source verified as main / before publication. Deployment result is recorded in local STATUS.md and HANDOFF.md after the push.
