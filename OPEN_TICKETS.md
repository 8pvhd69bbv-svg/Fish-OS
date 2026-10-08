# Fish OS Open Ticket Register

Baseline: V46 (live GitHub HTML); original register baseline V44. All issues below remain OPEN until the user expressly says they are resolved or closed.

| ID | Ticket | Area | Status | Acceptance / caution |
|---|---|---|---|---|
| FISH-004 | One private master backup containing private locations | Data | In Progress | Six historical coordinate pairs verified; live Supabase export and reconciliation still required. |
| FISH-005 | Portable hosting/provider-independent architecture | Architecture | Open | Planning only; no migration authorized. |
| FISH-006 | Selective Winamp chrome / nature-green theme, fish/rod/map icons and LCD | Design | Open | Style direction approved; implementation scope not yet specified; do not change without request. |
| FISH-007 | Deduplicate saved location records; reconcile 554 raw vs mapped | Locations | Open | V42 review tooling exists; no destructive cleanup approved. |
| FISH-008 | Safely enrich maps with missing verified region-level coordinates | Locations | Ready for Verification | Fish-shaped pins restored for all coordinate-bearing live locations; unmapped records still require location validation. |
| FISH-009 | Link vetted private research to country pages | Destinations | Open | Prior import had parsing errors; requires review. |
| FISH-010 | Populate fishing-window hopes/dreams calendar from notes | Calendar | Open | V42 placeholder is not full extraction. |
| FISH-011 | Reconcile biggest-fish and species counts from journal evidence | Tracking | Open | Do not treat estimates or sightings as measurements. |
| FISH-012 | Ensure iOS displays current release and private sync status | Mobile | Open | Cannot verify without browser/device test. |
| FISH-013 | Verify Supabase-backed persistence of all editors and files | Quality | Open | Individual flows need live functional testing. |
| FISH-014 | Consolidate legacy duplicate renderers safely | Quality | Open | Architecture review only; avoid changing working interface without approval. |
| FISH-015 | Master private file future updates and safe nonduplicating consolidation | Data | Open | Snapshots currently manual; no live-account access or automatic export. |
| FISH-016 | Restore V8 dashboard arrangement with live/private stats, Next Trip, map, recent, Today | Dashboard | Ready for Verification | V43 restores requested sections; user must verify desktop/mobile. No hardcoded stats. |
| FISH-017 | Verify one authoritative master from live Supabase and private file catalog | Data | In Progress | V43 read-only count comparison is NOT a complete merge/conflict test; live export, bytes, and restore test still required. |

| FISH-018 | Global search result dismissal and concise snippets | Search | Ready for Verification | V45 limits each result summary to 250 characters and V46 closes suggestions on outside click/Escape. User reports search otherwise solved; verify mobile and desktop. |
| FISH-019 | V8-style home dashboard Hours fished and Miles logged | Dashboard | Ready for Verification | V46 adjusts stats layout and injects recorded metrics. Hours and miles must come from real data; validate display, historical totals, and mobile. |
| FISH-020 | Display all valid saved map coordinates as fish-shaped pins | Maps | Ready for Verification | V46 renders all coordinate-bearing records, grouping identical coordinates. Check actual map against 24 mapped/51 saved; verify fish pins and geocoding gaps. No invented coordinates. |
| FISH-021 | Categorize Resources as Fly Shop, Regulations, Research | Resources | Ready for Verification | V46 categorizes on display using heuristics; Supabase categories remain unchanged. Audit classification accuracy before persistence. |
| FISH-022 | Supply packing baseline weights for custom items and accurate top totals | Packing | Ready for Verification | V46 estimates missing weights and totals on screen, without silently saving estimates. Verify checked/unchecked convention, quantities, zero weights, weight input persistence and trip-specific packs. |

## V45–V46 release notes and test status
- V45: search results capped at 30, with at most 250 characters of context; dashboard Hours fished and Miles logged adjustments attempted.
- V46: search closes on outside click/Escape; four-column desktop/2-column mobile stats; fish map markers for saved coordinates; on-screen Resources categories; estimated custom packing weights and total.
- V45 files: `index.html` and `Fish_OS_V45.html` at release time. V46 files: `index.html` and `Fish_OS_V46.html` at release time.
- Validation: GitHub commits and versioned copies completed; authenticated Supabase, real-device browsing and regression tests **not performed**.
- Safety: no intentional Supabase writes or private master uploads; do not infer live data correctness from static code.
- Known follow-ups: user did not see expected dashboard metrics after V45; verify V46 in browser. Location counts may differ from distinct plotted positions. Resources categorization currently nonpersistent. Packing baseline changes currently display-only.
- No existing ticket was closed.

## Release policy
- Never modify unrequested features. Flag unavoidable incidental changes with ⚠️ before release.
- Attach `index.html` and a matching versioned HTML file to every website update.
- Keep private master JSON out of the public repository.
- New tickets stay open until explicit user authorization to close them.
- Each future release should enumerate changed ticket IDs, unresolved tickets, and validation results.
- Do not assume this archive represents the current live Supabase account.

## Permanent Development Rules (not tickets)
- RULE-001: Change only features explicitly requested; flag incidental changes ⚠️.
- RULE-002: Review tickets before each development pass; only the user closes tickets.
- RULE-003: Deliver both `index.html` and an identical versioned HTML file.