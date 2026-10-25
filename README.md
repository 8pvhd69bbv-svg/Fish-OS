# Fish OS — FLYS FOR FISH

**The fishing operating-system hub for everything surrounding an angler's life.**

**Live application:** https://8pvhd69bbv-svg.github.io/Fish-OS/  
**Current documented release:** V1.0725 (partial update)

Fish OS is a personal fly-fishing headquarters connecting trips, waters, fishing journals, catches, gear, fly tying, research, uploads and future fishing plans. Records are intended to be entered once, preserved privately, searchable and reused across the system.

## Main areas
- **Dashboard:** next trips, fishing activity, statistics, maps and summaries.
- **Trips and calendar:** planned and completed outings, schedules, sessions and packing.
- **Waters and atlas:** location records, geographic references, maps and destination research.
- **Journal and tracking:** reports, confirmed catches and fishing history.
- **Gear and fishing pack:** rods, reels, lines, materials and trip-specific packing.
- **Flies and tying:** fly patterns, recipes, materials and notes.
- **Resources and uploads:** saved research links and private file/photo storage.
- **Stillwater:** a fishing game under References, with further features in development.

## Design philosophy
A dense, practical early-2000s desktop utility/file-browser interface with LimeWire/Winamp inspiration. Preserve readable compact controls, clear organization, responsive layouts and the existing fishing workflow.

## Development and documentation
**Start with [PROJECT_STATE.md](PROJECT_STATE.md) for the latest project handoff, development rules, known risks and priorities.** For detailed status:
- [OPEN_TICKETS.md](OPEN_TICKETS.md) — authoritative active ticket ledger and acceptance status.
- [DEVELOPMENT.md](DEVELOPMENT.md) — latest release implementation and verification.
- [DESIGN_IMPLEMENTATION.md](DESIGN_IMPLEMENTATION.md) — design components and verification requirements.
- [TICKET_HISTORY.md](TICKET_HISTORY.md) — previous ticket history.
- [HOSTING.md](HOSTING.md) — deployment and hosting portability.

The current entry point is `index.html`; the documented matching archive is `Fish_OS_V1.0725.html`. Historical HTML release copies follow the oldest + ten previous + current retention rule.

### Local verification
```sh
node scripts/preview.mjs
node scripts/check.mjs
node --test --test-isolation=none scripts/test-*.mjs
```

The loopback preview serves public application assets only. Private account data and uploads belong in Supabase, not the public GitHub repository.

For all implementation/architecture updates, update `PROJECT_STATE.md` alongside relevant code and ticket/release documentation. Do not mark tickets accepted without owner approval.
