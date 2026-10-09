# Fish OS — FLYS FOR FISH

**The fishing operating-system hub for everything surrounding an angler's life.**

**Live website:** https://8pvhd69bbv-svg.github.io/Fish-OS/  
**Current application release:** V62

The current prioritized work register is [OPEN_TICKETS.md](OPEN_TICKETS.md). V62 adds independent Fly Photos, Tying Knowledge and casting pages, restores Research categories, and adds editable trip country/state/geography while retaining the accepted dashboard and account isolation.

Run `node scripts/preview.mjs` for a loopback-only preview, `node scripts/check.mjs` for script validation, and `node --test scripts/test-account-isolation.mjs scripts/test-collections.mjs` for synthetic regressions. The preview serves public application assets only. `index.html` and `Fish_OS_V62.html` are identical release copies; earlier archives remain unchanged.

For fly photos, choose **Fly Photos** in the existing Upload category selector. Photos stay in private Storage and appear in Fly Tying → Fly Photos; originals remain in the file catalog. Tying Knowledge and each casting section store separate private notes. Inferred trip coordinates are approximate regional references, never exact fishing spots; existing values are preserved and the trip editor allows correction.

## The vision

Fish OS is meant to be a personal, interconnected fishing headquarters—not simply a catch log, trip planner, or gear spreadsheet. It brings the practical, historical, creative, and exploratory sides of fishing together in one searchable operating system. A trip becomes more than a date: it can connect to its destination, waterbody, fishing sessions, journal notes, catches, flies, rods, reels, packing list, photos, research, and future return plans.

The long-term aim is a durable record of the angler's fishing life and a workspace for deciding what to do next. Information should be entered once, preserved privately, searchable from anywhere, and reusable across the system.

### Main areas

- **Command center / Dashboard:** live overview, next trip, recent fishing activity, fishing statistics, and map. The requested V8-style arrangement and hours/miles visibility still require verification.
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
