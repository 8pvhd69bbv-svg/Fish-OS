# Fish OS — Prioritized Open Tickets
**Baseline:** V60 (2026-10-08). Source of truth: this GitHub register. Closed items are retained in the Closed section. Never close unverified items. User authorizes closing independently *confirmed complete data tickets*; otherwise request confirmation.

## P0 — Personal data storage and backup
| ID | Ticket | Status | Acceptance / next check |
|---|---|---|---|
| FISH-004 | Private master backup containing locations and all data | IN PROGRESS | Live account has 1 JSON data row and 2 private file objects. Need complete export, file bytes, manifest and restore test. NOT CONFIRMED COMPLETE. |
| FISH-015 | Safely reconcile master snapshots and future updates | OPEN | Conflict resolution, no duplicate imports, verified updates; not tested. |
| FISH-017 | One authoritative master from live Supabase and private files | IN PROGRESS | 51 locations, 44 trips, 9 journal entries verified in current live JSON. File catalog 2/2 present. No complete byte-level restore test. NOT CONFIRMED COMPLETE. |
| FISH-026 | Automated full backups online/offline and seasonal archives | PLANNED | Versioned encrypted snapshot, file catalog and bytes, scheduling, Media-drive local agent, checksum + restore, no public GitHub uploads. |

## P0 — Simple login and one-user product test
| ID | Ticket | Status | Acceptance / next check |
|---|---|---|---|
| FISH-029 | Streamlined FishOS-branded login | NEW | Hide backend configuration from ordinary users; password/magic link behind branded FishOS form, friendly errors, session persistence. Keep existing auth/RLS security. |
| FISH-030 | Invite and test second user safely | NEW | One test user, clear onboarding, verify strict account isolation and logout/login across devices. No data leaks. |
| FISH-013 | Supabase-backed persistence and account isolation | OPEN | Live sign-in, reload, record edit, attachments and permissions testing required. |
| FISH-012 | iOS session, current release and cloud state | OPEN | Test mobile reload, login status and sync. |

## P1 — Stability, navigation and essential features
| ID | Ticket | Status | Acceptance / next check |
|---|---|---|---|
| FISH-014 | Safely consolidate legacy renderers | OPEN | Numerous renderer overrides require architecture review + regression tests; no feature stripping. |
| FISH-019 | Dashboard hours fished and miles, V8 layout | OPEN / NOT VERIFIED | Previous patches did not reliably display. Test against live records; no fabricated totals. |
| FISH-016 | V8-style dashboard full sections | READY FOR VERIFICATION | Next Trip, map, recent, Today, responsive layout. |
| FISH-020 | Fish map pins for all verified coordinates | OPEN / NOT VERIFIED | Refresh/direct-navigation issue and distinct-coordinate counts. |
| FISH-022 | Packing weights, quantity totals, rich item edits | CLOSED (user confirmed 2026-10-08) | User confirms calculator now working; further improvements to be tracked separately. |
| FISH-027 | Edit species checklist | READY FOR VERIFICATION | V51 controls need authenticated end-to-end tests. |
| FISH-028 | Gear health and replacement tracking | USER ACCEPTED FOR NOW | V58 page covers eight categories, pending future expansion. |
| FISH-031 | Dashboard heading above CORE | IMPLEMENTED / VERIFY | V52 changes all three legacy navigation arrays to DASHBOARD heading before CORE. |
| FISH-032 | Consolidate private-file panels | READY FOR VERIFICATION | V59 merges Private Files and File Catalog, preserving child controls; Storage & Sync remains separately accessible. |
| FISH-033 | Improve/install consistent fish, rod, map icon pack | NEW / EVALUATE | Prefer versioned lightweight SVG set with approved license, no emoji; avoid risky unpinned CDNs or wholesale UI replacement. |
| FISH-018 | Search snippets and outside-click dismissal | READY FOR VERIFICATION | User previously confirmed search fixed. |

## P2 — Research, destinations and calendar
| ID | Ticket | Status | Acceptance / next check |
|---|---|---|---|
| FISH-009 | Connect verified private research to country pages | BLOCKED / NOT COMPLETE | Current live: 49 links, 0 country-assigned, destination_notes empty. Country page supports tagged matching, but bulk assignment cannot be trusted without vetted mapping. Preserve source records. |
| FISH-010 | Hopes-and-dreams fishing window | PARTIAL / WINDOW EXISTS | V42 already has Add Fishing Window dialog and calendar display. Need date-range/seasonal window fields, validation, source-note extraction after review. Do not invent dates. |
| FISH-008 | Verified map coordinate enrichment | READY FOR VERIFICATION | Missing pins require trusted coordinates; no guessing. |
| FISH-011 | Fish sizes and species totals from journal evidence | OPEN | Verify actual landed catches/measurements; do not infer from sightings. |
| FISH-021 | Resource classification | PARTIAL | V48 heuristic categorization not reliably correct. |
| FISH-024 | Persistent manually editable resource categories | IN PROGRESS | V50 filter buttons exist; need verified explicit category persistence. |
| FISH-025 | Upload-page resource-link shortcut | READY FOR VERIFICATION | V50 button; authenticated save-refresh check. |
| FISH-005 | Hosting portability | OPEN / PLANNING | No migration approved. |

## P3 — Media, warranties, social features and app
| ID | Ticket | Status | Acceptance / next check |
|---|---|---|---|
| FISH-034 | Integrated photo/video library, viewer and upload | NEW | Private Supabase Storage, albums/metadata, file validation, quotas, signed URLs, privacy. |
| FISH-035 | Selectable section photos, photography portfolio and fly-tying photos | NEW | Assign/reassign selected media to locations, fly tying, gear and portfolio without duplicating originals. |
| FISH-036 | Gear warranty wizard | NEW | Type → brand → exact official warranty links; evidence/checklist, claim preparation and form guidance. AI assistance should not submit a warranty claim without review and consent. |
| FISH-037 | Friend-code invites, messaging, permission-controlled sharing | NEW | Opt-in invitations, block/report, per-friend/group permissions enforced server-side with RLS; no public exposure. |
| FISH-038 | Installable FishOS app (PWA first) | NEW | Manifest, icons, safe offline shell, update flow, caching rules, testing; offline private data requires explicit security design. |
| FISH-023 | Stillwater prototype | CLOSED — user accepted | Playable placeholder accepted; advanced game separate. |
| FISH-039 | Stillwater rare-fish collection, breeding and growth | NEW / BACKLOG | Game-only data, isolated code and assets, no impact on real fish records. |
| FISH-040 | Arcade fish-target game inspired by duck-hunt mechanics | NEW / BACKLOG | Separate prototype/module; lightweight optional launch under References. |
| FISH-006 | Begin selective Winamp/nature-green visual refinement | STARTED / DESIGN REVIEW | V49 green/blue palette exists. Review selective chrome, LCD and icon styling without affecting function. Preserve existing visual language. |

## Closed (per user instruction)
| ID | Ticket | Closure |
|---|---|---|
| FISH-007 | CLOSED AT USER DIRECTION, 2026-10-08. Duplicate-safe location review exists. Live data still has 51 records and 15 repeated name+region groups; no destructive merge or deletion was performed. Closure does **not** certify deduplication completed. |

## Live data audit (read-only, 2026-10-08)
- Supabase project Fish OS connected and healthy. `public.fishos_user_data`: 1 row, RLS enabled, 4 policies; `public.fishos_files`: 2 rows, RLS enabled, 4 policies; private storage: 2 objects and 2 matching metadata records.
- Current JSON: trips 44, locations 51, journal 9, rods 18, flies 16, fishCaught 41, links 49, calendar_entries 0, trip_sessions 0, individual fish logs 0. Some keys store historical legacy structures. These counts are **not** a verified complete historical master.
- Links with explicitly stored country: 0/49. Links with explicitly stored category: 0/49. Data tickets 004, 009, 015, 017, 026 **not confirmed complete**.
- One backup-named private storage object exists, but completeness, file bytes and restorability remain unverified.
- No DB or private storage modifications made in this audit; no automated export/local Media-drive write performed.

## Release V52 / quality
- One isolated UI change: Dashboard moved from CORE into its own DASHBOARD group in all three navigation implementations. No other feature code changed.
- Files: `index.html` plus identical `Fish_OS_V52.html`. GitHub commit succeeded. Authenticated browser UI and iOS regression testing not yet completed.
- All future releases must preserve working functionality, enumerate changed ticket IDs, and describe tests/known limitations.

## Permanent development rules
- RULE-001: Change only user-authorized features; flag incidental changes in advance.
- RULE-002: Tickets stay open until user approval, except independently verified complete data tickets with granted closure authority.
- RULE-003: Every HTML release includes both `index.html` and identical `Fish_OS_VNN.html`.
- RULE-004: Never publish private master backups, personal records, photos, credentials, or secrets to GitHub Pages.
- RULE-005: No made-up fishing catches, measurements, coordinates, weather, flows, regulations or dates. Keep estimates labeled.

## V53 — P0 implementation / needs real-browser verification
- FISH-029: FishOS-branded sign-in; Supabase project URL and public publishable key preconfigured; advanced account diagnostics retained at account-settings. **Only public client key is shipped; user password and service-role keys are not embedded**. Test password/magic link, remembered sessions, logout, and separate user.
- FISH-041: Secure optional FishOS AI gateway and UI. Edge Function `fishos-ai` deployed with verify_jwt=true and user validation in endpoint; the OpenAI API key **is not configured**, so AI answering is currently blocked pending server-side secret setup. No private account records transmitted automatically. Add rate limits, spend controls and model validation before enabling production.
- FISH-042: Show release version on Dashboard on all future versions: V53 badge attached to active home renderer. Update VERSION constant in each new release; verify page display.
- FISH-023: Stillwater concept moved to active dedicated route and visible Resources/References sidebar link; not playable.
- FISH-021/FISH-024: Replaced inactive link-render overrides with active catalog page supporting add/edit and explicit saved category; verify data persistence before closure.
- FISH-022: Active packing page replaced with item weights, quantities, top total and edit; baseline amounts labeled as estimates, not measured. Verify saved values and page interactions.
- FISH-033: Added local versioned SVG assets `icons/fish.svg`, `icons/map.svg`, `icons/rod.svg`. No remote icon pack dependency.
- DATA P0: No master restore test or automatic offline Media-drive backup implemented. FISH-004/015/017/026 remain open. Supabase RLS exists; auth security advisor found leaked password protection disabled — consider enabling in Supabase dashboard.
- V53 files: `index.html` and identical `Fish_OS_V53.html` archive. GitHub repository updated, Edge Function deployed. Browser/authenticated regression testing **not completed**. All tickets remain open except user-closed FISH-007.

## V54 — Remembered login restoration
- FISH-029: Added automatic Supabase getSession bootstrap and delayed signed-in hydration for returning users; updated dashboard version to V54. Signed-in browser test remains necessary; did not weaken RLS.
- FISH-042: Dashboard release label V54 is in the active renderer code. No verification against user's session yet.
- Releases: `index.html` and identical `Fish_OS_V54.html`. FISH-041 AI gateway still lacks server-side OpenAI API key and remains unavailable.

## V55 — live coordinate completion (2026-10-08)
- Private Supabase update applied: 27 blank location coordinates populated across nine named map reference locations (repeated database rows). 51/51 location rows now have latitude and longitude; 24 existing coordinate pairs preserved. New pairs clearly flagged `coordinate_accuracy: approximate` with source URLs and `coordinate_note`. No original coordinate was overwritten, no locations were deleted, and no master offline backup/restore test was completed.
- User-supplied geographic context: Metolius near Sisters, Wickiup Reservoir in Oregon, Imnaha River near Joseph, Bighorn at Fort Smith, Nestucca near Hebo, and Caye Caulker in Belize. Existing coordinates for Metolius, Wickiup, Bighorn and Nestucca were retained because user requested replacements only when specific coordinates are provided; note that existing Nestucca coordinate has not been moved to Hebo.
- FISH-008/FISH-020 still need map display/regression testing. Distinguish 51 rows from 15 unique named groups; approximate markers must not be presented as exact fishing locations.
- FISH-022 CLOSED on explicit user confirmation; later packing refinements are separate work.
- V55 website code includes dashboard version chip, playable standalone Stillwater mini-game, new Outfitters category, newest-first Trips, and additional local SVG icons. `index.html` and matching `Fish_OS_V55.html` are in GitHub. Browser QA still needed.

## V56 — rollout data durability (2026-10-08)
- P0: Created `public.fishos_data_revisions` with owner-scoped read-only RLS and trigger on `fishos_user_data` INSERT/UPDATE of changed JSON data. Existing account was seeded with one initial snapshot. Trigger active and row count verified; does not cover private file bytes, separate cloud outages or offline backup.
- P0: Upload page includes portable private JSON + file metadata export, separate private storage file download, and entire accessible revision-history JSON download. The HTML deploy was committed, but these controls must be browser-tested while signed in. Browser multi-download permission may be required. No files or secrets published on GitHub.
- FISH-042: added prominent dashboard build chip for V56, in addition to prior subtle label. Await live confirmation.
- FISH-004/FISH-015/FISH-017/FISH-026: PARTIAL; no verified independent Media-drive backup or restoration test; do not close. FISH-029/FISH-030: second-user login and isolation require actual human test; RLS predicates checked.
- FISH-022 remains CLOSED based on user's observed success.
- V56 source: `index.html` and same `Fish_OS_V56.html` archive. No private data overwritten.

## V59 ticket assessment
- FISH-042 CLOSED: user confirms visible release label. Top bar now reads V59.
- FISH-023 CLOSED: user confirms Stillwater playable placeholder works for now.
- FISH-046 NEW: Maps restored links to onX, Google Earth, USGS National Map (V59); verify browser links.
- FISH-047 NEW: Dashboard changeable live USGS hydrographs for Nestucca/Deschutes/Wilson; 7-day provisional readings with timestamp/staleness/error handling, V59; test network availability.
- FISH-048 NEW: Species checklist lock beside Add Species, default locked, guarded caught-target edits; V59; test on Fish List and Fish Tracker.
- FISH-049 NEW: Reported and estimated Days/Hours on V8 dashboard, 6 assumed hours per day of completed trip date spans; V59; estimates are not historical observations.
- FISH-050 NEW: Gear collection value fixes 9-column rod-price indexing and adds entered component costs; V59; test inventory after edits.
- FISH-032: Private Files and catalog panels consolidated into one while retaining all controls; awaiting live verification.
- FISH-028: user satisfied with initial dedicated Gear Health page.
- FISH-004/015/017/026/045: fully automatic offsite/local backup + restore remain open and highest priority.

## V60 release — pending user validation
- Research reverted to classic hub. Uploads Research category links privately saved research files back to Research.
- Dashboard design V9 (site V60) has persistent USGS chart panel; verify live station data.
- Map initialization retries on navigation without page refresh.
- Gear Health has an editable Brand field stored independently in private account gear metadata when saved; one-click index for existing inventory brands.
- Calendar has top-right Upcoming fishing opportunities panel, empty until dated opportunities exist.
- Open: signed-in browser acceptance tests, data backup and independent restore tests.
