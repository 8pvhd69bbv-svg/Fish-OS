# Fish OS — FLYS FOR FISH

**The fishing operating-system hub for everything surrounding an angler's life.**

**Live website:** https://8pvhd69bbv-svg.github.io/Fish-OS/  
**Current application release:** V50

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
- **FishOS Arcade:** a separate future recreational branch. V50 introduces the non-playable **Stillwater** concept page under Resources. It does not ship a game engine or touch personal records.

## Design philosophy

Fish OS adopts the information density and tactile interface of early-2000s desktop utilities and file browsers, with LimeWire/Winamp inspiration. Keep compact navigation, clear organization, useful visual cues, mobile usability, and restrained nature greens with selective slate-blue accents. The information is the priority; decorative or game functionality must not interrupt essential workflows.

## Data architecture

`index.html` contains the browser application deployed by GitHub Pages. GitHub stores **public code and public website assets only**.

Supabase authenticates users and provides account-scoped private records via `public.fishos_user_data`, `public.fishos_files` metadata and private `fishos-private` storage. Supabase RLS must enforce access control. Never expose service-role keys in public code.

User data is not safely backed up just because HTML versions are archived. A complete backup must include the latest private JSON data, referenced private file bytes, a catalog/manifest, checksums, and a tested restore path.

### Backup direction (planned, not yet implemented)

1. Export a full authenticated private snapshot and file manifest with a date/season identifier.
2. Back up associated private files, not only their URLs or metadata.
3. Copy encrypted snapshots to an independently controlled backup destination and to the user's Windows Media drive through an explicit local sync client.
4. Schedule periodic snapshots plus season-end archives; verify integrity and periodically test a restore.
5. Keep several historical versions and reject silent conflicts. Browser downloads alone cannot reliably write an unattended file to a specific Windows drive.

**Status:** automatic two-location backup and recovery are not implemented. Do not upload the private master to the public repository or deploy it with GitHub Pages.

## Releases and tickets

- `index.html` is the current live entry point. `Fish_OS_VNN.html` files are immutable versioned copies.
- `OPEN_TICKETS.md` holds the project backlog and release acceptance conditions. Only the user closes tickets.
- Scope changes narrowly. Preserve unrelated features; flag unavoidable changes before release.
- Verify changes in an authenticated browser on desktop and mobile. A successful Pages deployment does not establish correct application behavior.
- Preserve private data and working UI. Treat derived or estimated field data explicitly as such.

**V50 changes:** Stillwater concept landing page; resource filter buttons; Upload Guide shortcut to add a website link; README expansion. The game is concept-only. Existing problems with stats, packing, map counts and some classification accuracy remain unverified.

See [OPEN_TICKETS.md](OPEN_TICKETS.md) for detailed status.
