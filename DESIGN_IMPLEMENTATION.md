# Design implementation and verification

V1.068 implements the approved page compositions. The earlier local V1.067 candidate applied a shared theme but retained too much legacy structure. It was never published and is superseded.

## Current implementation

One current page composition module: `assets/fishos-design-v1-068.js`. One current stylesheet: `assets/fishos-ui-v1-068.css`. Read-only models are in `assets/fishos-design-models-v1-068.js`. Existing editors, upload handlers, account guards and persistence remain authoritative.

| Page | Reference structure implemented | Behavior retained |
|---|---|---|
| Home | Two distance cards, live map, catch/order summaries, recent catches, order steps | Recorded distances and labeled estimates; live map; workspace/flow tools remain in an expander |
| Trips | Separate Upcoming/Past cards, compact water/people/date rows, Open/Closed actions | Existing trip forms, exact stored names/dates, trip workspaces and linked logs |
| Journal | Four totals, wrapping filters, dated entry cards, species chips, month/water sidebar, undated attention | Existing full-page editor and original record indexes |
| Locations | Four totals, duplicate-safe notice, region cards, record counts and Mapped chips | Existing duplicate review, Details and Pin handlers; no data merges |
| Fly Pattern Index | Twelve wrapping category filters, thumbnail/category/name/species/note cards | Existing pattern and material editors; artboard streamer, nymph and hook SVGs copied directly |
| Gear Health | Three totals, condition alert, category filters, compact item list and assessment sidebar | Existing assessment editor, inventory links, names and brands |
| Tracking | Activity rings and legend, travel coverage, species bars, ranked fish, weights and linked catches | Existing formulas, assumptions and catch/source editors; rings labeled illustrative |
| Upload | One upload area, file drop/choose controls, status column, Files, backup/portable columns and collapsed guide | All original add/import/export/file controls; secondary modes in an expander; combined backup action also retains individual exports |
| Owner Tools | Admin badge, switch-styled reference controls, backup entry point and secondary tools | Existing owner restriction, checkbox handlers, estimate and project tools |

Other existing pages use the same shell, typography, spacing, surfaces and controls. Their feature layouts are retained because no individual artboard was supplied.

## Approved additive routes

- `#water-profile`: select a saved water; exact linked journal/location/fish records, explicitly linked flies and links to existing editors.
- `#season-recap`: select a season; dated records, reused distance calculations, species/month/water summaries and biggest fish. Editing links open the existing Tracking page.
- `#pre-trip`: upcoming trip, inventory condition flags, saved fly-category coverage, linked packing progress and the last matching journal. Links open the source pages.

These views do not create records, infer ownership, change stored dates or write account data. Empty states replace unavailable information. Country reference locations remain separate from visited/private waters.

## Data-dependent differences

Artboard counts, names, dates, orders and storage sizes are examples, not application defaults. The interface uses account records. No invented order rows, backup timestamps/history, fishing locations or cloud capacity are displayed. Owner backup actions lead to existing Upload controls; a consolidated backup-history service does not yet exist. Automatic market-listing valuation remains a separate open ticket.

## Verification contract

1. Read the handoff and every supplied page layout before implementation.
2. Compare structure as well as tokens: columns, section order, controls, empty states and illustrations.
3. Verify populated synthetic records, not just signed-out empty pages. Run the loopback preview and open `/__design-review`; this test-only response is not part of the deployed HTML.
4. Confirm the actual viewport width before responsive checks. Check all sidebar routes at 390px and 1440px, including the three new routes.
5. Exercise filters and existing editor entry points; run script validation, regressions and `node scripts/audit.mjs`.
6. Review the complete proposed Git tree, preserve historical releases/assets, verify Pages source, publish when requested, then verify the deployed version and routes.
7. Update the local handoff and ticket ledger. Completion of a color theme alone does not establish design completion; ticket acceptance remains with the owner.

## Source audit

The current static dependency graph contains no duplicate loaded asset paths, missing current assets or assets unreferenced by every current/historical release. Twenty-five legacy inline renderer wrappers remain in inherited controller code. Four redesigned pages now bypass that legacy render chain. Remaining controller consolidation requires incremental regression coverage; deleting the inherited chain wholesale would risk account, import, backup and trip behavior.

Two obsolete high-contrast/Y2K skin blocks, the duplicate release badge, and the unpublished V1.067 presentation module were removed from the current entry. Published historical HTML files remain present. Their referenced V1.066 stylesheet retains its released content.
