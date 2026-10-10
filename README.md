# Fish OS — FLYS FOR FISH

**The fishing operating-system hub for everything surrounding an angler's life.**

**Live website:** https://8pvhd69bbv-svg.github.io/Fish-OS/  
**Current application release:** V1.066

The current prioritized work register is [OPEN_TICKETS.md](OPEN_TICKETS.md). V64 separates fishing and travel estimates, enables confirmed journal-linked catch records, adds named packing lists and completed-trip locks, and expands inventory charts and Owner Tools. See [DEVELOPMENT.md](DEVELOPMENT.md) for the current handoff.

Run `node scripts/preview.mjs` for a loopback-only preview, `node scripts/check.mjs` for script validation, and `node --test scripts/test-account-isolation.mjs scripts/test-collections.mjs scripts/test-workspace.mjs` for synthetic regressions. The preview serves public application assets only. `index.html` and `Fish_OS_V1.066.html` are identical release copies; earlier archives remain unchanged.

For fly photos, choose **Fly Photos** in the existing Upload category selector. Photos stay in private Storage and appear in Fly Tying → Fly Photos; originals remain in the file catalog. Tying Knowledge and each casting section store separate private notes. Inferred trip coordinates are approximate regional references, never exact fishing spots; existing values are preserved and the trip editor allows correction.

## The vision

Fish OS is meant to be a personal, interconnected fishing headquarters—not simply a catch log, trip planner, or gear spreadsheet. It brings the practical, historical, creative, and exploratory sides of fishing together in one searchable operating system. A trip becomes more than a date: it can connect to its destination, waterbody, fishing sessions, journal notes, catches, flies, rods, reels, packing list, photos, research, and future return plans.

The long-term aim is a durable record of the angler's fishing life and a workspace for deciding what to do next. Information should be entered once, preserved privately, searchable from anywhere, and reusable across the system.

### Main areas

- **Command center / Dashboard:** live overview, next trip, recent fishing activity, fishing statistics, and map. The dashboard arrangement is user accepted.
- **Trips and calendar:** upcoming adventures, completed outings, trip sessions, fishing windows, plans, locations, and follow-up notes.
- **Waters and maps:** rivers, lakes, destinations, location records, regional research, fish-shaped pins and coordinates. Never invent coordinates.
- **Journal and tracking:** firsthand field reports, fishing hours, mileage where recorded, catch evidence, species checklists and historical fishing activity. Distinguish verified catches from estimates, sightings or research.
- **Gear and fishing pack:** rods, reels, lines, fly boxes, field kits, materials, tippet, owned equipment, purchases, and trip-specific packing with editable quantities and estimated/measured weights.
- **Flies and tying:** pattern catalog, material inventory, fly selection, and personal fly-tying knowledge.
- **Destination atlas and research:** organized fisheries worldwide, regional notes, operators, research references and opportunities to revisit.
- **Resources / references:** a searchable, account-scoped link catalog with Fly Shop, Regulations and Research filtering. Classification is currently heuristic/on-screen; stored categories need a separate verification and editing workflow.
- **Uploads and files:** an interface for private storage and attachments, with a link-entry shortcut to the Resources catalog. The website repository itself is not a private photo archive.
- **FishOS Arcade:** a separate future recreational branch. Stillwater has its own game page under References.

## Design philosophy

Fish OS adopts the information density and tactile interface of early-2000s desktop utilities and file browsers, with LimeWire/Winamp inspiration. Keep compact navigation, clear organization, useful visual cues, mobile usability, and restrained nature greens with selective slate-blue accents. The information is the priority; decorative or game functionality must not interrupt essential workflows.

## Development

Keep earlier HTML release archives. Use the public feature checklist in OPEN_TICKETS.md for priorities; detailed maintenance notes remain local.

Run node scripts/check.mjs and the synthetic tests before publishing. Preserve existing routes and controls when adding pages.

V1.066: grouped tickets (Closed last), visible estimated hours/days, automatic editable reported journal catches, inventory category selectors, separate reel line class and physical ounces, past-trip status, owner-only tools and per-control references. Release names now use V1.NNN; historical archives keep their original names.

This release also adds an automatic owner-scoped server master and private downloadable master, full-page journal editing, linked trip notes, girth-based weight estimates using Wisconsin DNR formulas, and rod/reel/line classification tools. Uploaded media remain in private Storage and are included by manifest; this does not create an offsite media archive. Backend reconciliation, renderer consolidation, login simplification and live second-user testing remain tracked.


V1.066 adds a darker, responsive workspace while retaining header identity and routes; unified inventory editing with category moves, confirmed deletion and classification controls; reliable category/search/sort results; a collection-value breakdown; trip-specific maps and matching private research/files; and clearer Upload choices. Historical reconciliation is audited privately, with current records authoritative. Standalone Custom Icons navigation is retired; existing routes redirect to Upload.
