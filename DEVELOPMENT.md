# Fish OS V1.0725 — partial update

This is a partial update, not a full Update. Current game work belongs to FISH-039. FISH-040 is removed from the active ledger and application ticket page. Remaining planned features stay open; no new acceptance is inferred.

| Browser comments | Changes |
|---|---|
| 1, 19 | Flatten nested navigation grids; Fly Tying uses four columns and Gear six, with responsive wrapping. |
| 2–4 | Separate trip names from readable date ranges; Completed replaces Closed. |
| 5–7 | Blue Waters statistic; section-photo controls collapse behind Edit Photo; location pages attach private-library photos. |
| 8–10 | Edit original calendar entries, trips and fishing opportunities; highlight the current local day. |
| 11–13 | Poor/Replace statistic filters items; assessment and alphabetical filters; Nets label, bag records remain under Packs. |
| 14–17 | Dark tracker progress panel, brown-trout art, explicit percent caught and bright-green Caught labels. |
| 18, 20 | Crop the Fly Rod title from the anatomy display; remove the second Inventory rod image. |
| 21 | Country cards open dedicated pages; country coordinates and coordinate import controls move off the atlas listing. |
| 22 | Packing starts on New List with an empty FIELD draft; existing and completed-trip lists remain separate. |
| 23 | One resource card with unique notes; Remove Resource and Combine Copies controls. Combining retains unique notes and conflicting metadata as notes. |
| 24–25 | Full fly pages for recipes, instructions, notes, lists and photos; thumbnail select/change/remove and icon fallback. |
| 26–27 | Owner Tools under System above Account; Year Recap wording. |
| 28–30 | Brighter reference-inspired game palette, rounded sans typography, Wyatt character, visible keyboard hints and controls fitted to the game viewport. |

Backend progress: new detail/calendar/account hooks share a single dispatcher; historical inline renderers still need incremental consolidation. Branded login has inline feedback, password visibility, Enter submission and duplicate-submit protection. Magic links do not create uninvited accounts. `scripts/package-site.mjs` builds a public-only hosting bundle; see HOSTING.md.

Read-only backend checks on October 18 confirmed RLS on all four application tables, ownership policies, private Storage, master/revision triggers and matching current snapshots. Advisor warning: leaked-password protection is disabled. No production records, schema, policies or account settings were changed. Live second-account testing remains unavailable until a tester/account is supplied; live photo/upload saves and alternate-host authentication remain unverified.

Validation: syntax and static dependency audit; 104 passing synthetic regression tests; signed-out browser checks with synthetic fixtures. Earlier HTML archives and supporting assets are preserved. Artwork references remained outside the public repository; the existing public Wyatt cutout is reused.

Next work is explicitly tracked in OPEN_TICKETS.md. The broader media, sharing, PWA, warranty, recipe/material and game growth backlog is not represented as complete by this release.
