# Fish OS current development handoff

Current release: **V1.066**. Entry point: `index.html`; matching release archive: `Fish_OS_V1.066.html`.

## Continue development

Read `AGENTS.md` and `OPEN_TICKETS.md` before editing. The ticket table records user acceptance separately from implemented work. Keep the existing application and functions; use focused changes.

Use `node scripts/preview.mjs` for a preview and `node scripts/check.mjs` for syntax checks. Run the tests under `scripts/test-*.mjs` for changes affecting records or navigation. Publish the entry point and identical release archive together.

## Latest changes

V64 adds separate fishing/travel estimates with explicit assumptions, user confirmation of journal-linked catches, named packing lists with completed-trip protection, high contrast page references, USA labels, map tools below the map, inventory charts and an updated gear diagram. Research Notes holds imported user source notes, which must not be treated as current verified regulations or prices. The full Tickets page saves user review checkmarks privately; repository status is still maintained by Codex.

V64 fixes the built-in Back button, adds editable journal entries sorted newest first, and adds an inventory editor for packs, reels, lines, boxes, bags, nets and waders. Packs are included in Gear Health. The sidebar begins with Dashboard, CORE, TRACKING, then the existing sections.

Owner Tools contains optional page references and links to this handoff, tickets, account settings and Upload. It provides tools for the signed-in user's own account; it does not create an administrative role.

Tying Knowledge is `#tying-knowledge`; Fly Photos is `#fly-photos`. The separate casting pages are `#casting-drills`, `#casting-spey` and `#casting-saltwater`. Use the page reference and exact button label when describing a change.

Metolius uses USGS station 14091500. Miami uses historical station 14301300, which may have no recent discharge data. Kilchis is listed with an explicit unavailable gauge notice and an Oregon fishing report link; nearby Wilson readings are never presented as Kilchis measurements.

## File organization

Git preserves code history. Earlier release archives and the assets they reference remain available. Keep one current handoff rather than a handoff copy for every release. Store private exports and recovery notes outside the repository. Local ignored `HANDOFF.md` and `STATUS.md` hold the current machine-specific continuation details.

Do not duplicate an entire private backup for code-only releases. Verify the existing recovery package before removing disposable extraction or encoding files. Review historical source records before deduplicating them.

## Outstanding verification

Live two-account and mobile verification remain open. New journal and inventory controls need the user's review. Historical record reconciliation remains separate from recovery testing.

V1.066: grouped tickets (Closed last), visible estimated hours/days, automatic editable reported journal catches, inventory category selectors, separate reel line class and physical ounces, past-trip status, owner-only tools and per-control references. Release names now use V1.NNN; historical archives keep their original names.

This release also adds an automatic owner-scoped server master and private downloadable master, full-page journal editing, linked trip notes, girth-based weight estimates using Wisconsin DNR formulas, and rod/reel/line classification tools. Uploaded media remain in private Storage and are included by manifest; this does not create an offsite media archive. Backend reconciliation, renderer consolidation, login simplification and live second-user testing remain tracked.


V1.066 adds a darker, responsive workspace while retaining header identity and routes; unified inventory editing with category moves, confirmed deletion and classification controls; reliable category/search/sort results; a collection-value breakdown; trip-specific maps and matching private research/files; and clearer Upload choices. Historical reconciliation is audited privately, with current records authoritative. Standalone Custom Icons navigation is retired; existing routes redirect to Upload.

## Account and workflow answers

Signed-in changes persist after a successful cloud save and are loaded again after login. Upload stores original files privately; file contents do not automatically become structured records. The current server MASTER updates with records and file-catalog changes; its downloadable Storage copy refreshes after successful saves/account loading. Previously downloaded local files are snapshots, and original uploaded media are separate from record JSON.

Users create a Fish OS account with email/password (email confirmation may be required). They do not need a Supabase dashboard account.

For professional fly-fishing customer service, existing resources, pattern knowledge, line/rod classifications and warranty/purchase notes provide a starting knowledge base. Useful future additions include searchable product specifications, compatibility guides, warranty checklists and reusable answer templates.

Remaining priorities: real two-account and iPhone session/upload verification, smaller legacy renderer modules, and verified structured interpretation of source research. Historical reconciliation preserves ambiguous variants rather than inventing dates or replacing current records.
