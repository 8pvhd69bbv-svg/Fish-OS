# Fish OS — Work Checklist

Largest to smallest within each group. Accepted work remains current for three published releases, then moves to [ticket history](TICKET_HISTORY.md). Descriptions explain the expected behavior and verification limits.

## Pending

| Ticket | Feature | Size | Status |
|---|---|---|---|
| FISH-009 | Connect verified private research to country pages | Large | BLOCKED / NOT COMPLETE |
| FISH-034 | Integrated photo/video library, viewer and upload | Large | PARTIAL — V1.073 protects attached files during deletion; full media library remains planned |
| FISH-037 | Friend-code invites, messaging, permission-controlled sharing | Large | NEW |
| FISH-038 | Installable FishOS app (PWA first) | Large | NEW |
| FISH-039 | Stillwater fishing adventure, collection and growth | Large | ACTIVE — current fishing game; V1.0725 artwork, keyboard controls and viewport improvements; breeding/growth remains planned |
| FISH-067 | Fly recipes linked to material availability | Large | Planned from user vision |
| FISH-021 | Resource classification | Medium | PARTIAL |
| FISH-024 | Persistent manually editable resource categories | Medium | IN PROGRESS |
| FISH-033 | Improve/install consistent fish, rod, map icon pack | Medium | Supplied brown trout, rods and Wyatt artwork integrated; owner review pending |
| FISH-035 | Selectable section photos, photography portfolio and fly-tying photos | Medium | Photo selection implemented; V1.073 deletion checks local/cloud attachments; live photo test pending |
| FISH-036 | Gear warranty wizard | Medium | NEW |
| FISH-056 | Back navigation | Medium | Fixed newer-route Back history; regression checks pass; owner review pending |
| FISH-063 | Journal-linked editable catches | Medium | Implemented — automatic reported catches; editable in Tracking |
| FISH-066 | Private research note organization | Medium | Mixed source notes reorganized privately; original text retained; ambiguous Oregon pins pending |
| FISH-025 | Upload-page resource-link shortcut | Small | Drop/picker and URL review implemented; synthetic checks pass; live upload verification pending |

## Issues

| Ticket | Feature | Size | Status |
|---|---|---|---|
| FISH-011 | Fish sizes and species totals from journal evidence | Medium | OPEN |

## Backend

| Ticket | Feature | Size | Status |
|---|---|---|---|
| FISH-014 | Safely consolidate legacy renderers | Large | PARTIAL — current renderer isolated; new page hooks share one dispatcher; legacy inline chain remains |
| FISH-015 | Automatic current master and future updates | Large | Implemented; master/revision triggers and live snapshot/manifest parity rechecked October 25; awaiting acceptance |
| FISH-017 | Historical record reconciliation | Large | Available historical sources reconciled; ambiguous source records retained; awaiting acceptance |
| FISH-005 | Hosting portability | Medium | Public-only hosting bundle and migration runbook implemented; alternate-host sign-in verification pending |
| FISH-013 | Account persistence | Medium | RLS and snapshot parity verified; isolation regressions pass; live two-account test remains FISH-030 |
| FISH-026 | Recurring recovery checks | Medium | Automatic parity/download checks implemented; live snapshot and file-manifest parity rechecked October 25; offline recovery tests pass |
| FISH-029 | Streamlined FishOS-branded login | Medium | Branded login, inline feedback, duplicate-submit guard, password visibility and keyboard submit implemented; live tester review pending |
| FISH-030 | Invite and test second user safely | Medium | REQUIRES TESTER — only one account has saved data; second-user sign-in/upload/isolation verification remains |

## Recently accepted

| Ticket | Feature | Size | Status |
|---|---|---|---|
| FISH-058 | Add/edit gear and pack health integration | Medium | CLOSED — owner accepted V1.071; archive after V1.074 |
| FISH-032 | Consolidate HTML release backups | Medium | CLOSED — verified oldest + 10 previous copies; V1.071 accepted, archive after V1.074 |

Accepted V1.071; retain through V1.074. FISH-060 is routine maintenance, not a ticket.

## Ticket descriptions

### FISH-005 — Hosting portability

Hosting portability. Preserve current behavior while completing this feature. Verify the affected page and cloud persistence before marking it accepted.

### FISH-009 — Connect verified private research to country pages

Connect verified private research to country pages. Preserve current behavior while completing this feature. Verify the affected page and cloud persistence before marking it accepted.

### FISH-011 — Fish sizes and species totals from journal evidence

Fish sizes and species totals from journal evidence. Preserve current behavior while completing this feature. Verify the affected page and cloud persistence before marking it accepted.

### FISH-013 — Account persistence

Account persistence. Preserve current behavior while completing this feature. Verify the affected page and cloud persistence before marking it accepted.

### FISH-014 — Safely consolidate legacy renderers

Safely consolidate legacy renderers. Preserve current behavior while completing this feature. Verify the affected page and cloud persistence before marking it accepted.

### FISH-015 — Automatic current master and future updates

Automatic current master and future updates. Preserve current behavior while completing this feature. Verify the affected page and cloud persistence before marking it accepted.

### FISH-017 — Historical record reconciliation

Historical record reconciliation. Preserve current behavior while completing this feature. Verify the affected page and cloud persistence before marking it accepted.

### FISH-021 — Resource classification

Resource classification. Preserve current behavior while completing this feature. Verify the affected page and cloud persistence before marking it accepted.

### FISH-024 — Persistent manually editable resource categories

Persistent manually editable resource categories. Preserve current behavior while completing this feature. Verify the affected page and cloud persistence before marking it accepted.

### FISH-025 — Upload-page resource-link shortcut

Upload-page resource-link shortcut. Preserve current behavior while completing this feature. Verify the affected page and cloud persistence before marking it accepted.

### FISH-026 — Recurring recovery checks

Recurring recovery checks. Preserve current behavior while completing this feature. Verify the affected page and cloud persistence before marking it accepted.

### FISH-029 — Streamlined FishOS-branded login

Streamlined FishOS-branded login. Preserve current behavior while completing this feature. Verify the affected page and cloud persistence before marking it accepted.

### FISH-030 — Invite and test second user safely

Invite and test second user safely. Preserve current behavior while completing this feature. Verify the affected page and cloud persistence before marking it accepted.

### FISH-032 — Consolidate HTML release backups

Owner clarified scope: retain current release, 10 previous HTML copies and oldest HTML release. Other recovery snapshots remain private. Verified during V1.071.

### FISH-033 — Improve/install consistent fish, rod, map icon pack

Improve/install consistent fish, rod, map icon pack. Preserve current behavior while completing this feature. Verify the affected page and cloud persistence before marking it accepted.

### FISH-034 — Integrated photo/video library, viewer and upload

Integrated photo/video library, viewer and upload. Preserve current behavior while completing this feature. Verify the affected page and cloud persistence before marking it accepted.

### FISH-035 — Selectable section photos, photography portfolio and fly-tying photos

Selectable section photos, photography portfolio and fly-tying photos. Preserve current behavior while completing this feature. Verify the affected page and cloud persistence before marking it accepted.

### FISH-036 — Gear warranty wizard

Gear warranty wizard. Preserve current behavior while completing this feature. Verify the affected page and cloud persistence before marking it accepted.

### FISH-037 — Friend-code invites, messaging, permission-controlled sharing

Friend-code invites, messaging, permission-controlled sharing. Preserve current behavior while completing this feature. Verify the affected page and cloud persistence before marking it accepted.

### FISH-038 — Installable FishOS app (PWA first)

Installable FishOS app (PWA first). Preserve current behavior while completing this feature. Verify the affected page and cloud persistence before marking it accepted.

### FISH-039 — Stillwater fishing adventure, collection and growth

The current Stillwater game is FISH-039. V1.0725 applies the supplied artwork direction, Wyatt, readable typography and keyboard controls. Existing fishing, quests, lodge service, collection and save behavior remain. Rare-fish breeding and growth are still planned. FISH-040 was removed at the owner’s request; it is not a separate game project.

### FISH-056 — Back navigation

Back navigation. Preserve current behavior while completing this feature. Verify the affected page and cloud persistence before marking it accepted.

### FISH-058 — Add/edit gear and pack health integration

Add/edit gear and pack health integration. Preserve current behavior while completing this feature. Verify the affected page and cloud persistence before marking it accepted.

### FISH-063 — Journal-linked editable catches

Journal-linked editable catches. Preserve current behavior while completing this feature. Verify the affected page and cloud persistence before marking it accepted.

### FISH-066 — Private research note organization

Private research note organization. Preserve current behavior while completing this feature. Verify the affected page and cloud persistence before marking it accepted.

### FISH-067 — Fly recipes linked to material availability

Fly recipes linked to material availability. Preserve current behavior while completing this feature. Verify the affected page and cloud persistence before marking it accepted.

## October 16 design directive — awaiting owner acceptance

The prior local candidate reused FISH-068–073. Those IDs remain assigned to their original accepted work in TICKET_HISTORY.md; the new requests use FISH-078–085.

| Ticket | Feature | Size | Status |
|---|---|---|---|
| FISH-078 | Reference page layouts and consistent UI across every existing page | Large | Implemented V1.068; awaiting owner review |
| FISH-079 | Duplicate resources | Medium | One card per resource; Combine Copies preserves unique notes; Remove Resource removes its copies; awaiting acceptance |
| FISH-080 | Shared country atlas and geographic references | Medium | 193 existing entries mapped; private overlays retained |
| FISH-081 | Inventory line brands, reel colors and retail cost | Medium | Implemented; synthetic save verified |
| FISH-082 | Estimated resale with current online listings | Medium | Planning estimate and manual comparables implemented; automatic listings/brand model OPEN |
| FISH-083 | One current handoff and local file cleanup | Small | Maintained; exact loose duplicates removed; recovery copies retained |
| FISH-084 | Water Profile, Year Recap and Pre-trip Check | Medium | Implemented; Year Recap naming corrected in V1.0725; awaiting acceptance |
| FISH-085 | Cancel backup exports across account changes | Medium | Implemented; delayed-query regression tests pass |

FISH-014 audit: removed conflicting cosmetic layers and superseded UI candidate; established one current design renderer and stylesheet. Current/historical static dependencies have no missing or unreferenced assets. Twenty-five inherited inline renderer wrappers remain; four designed pages now bypass that chain. Further consolidation must preserve existing account/import/backup/trip behavior through incremental tests.

## Release practice

Responsive layout, release identity and cloud/session checks run every release. Actual iOS and live-account verification limits must be reported. This routine work is no longer an issue ticket (formerly FISH-012). Only user acceptance closes a ticket. Keep newly accepted tickets for three published releases, recording acceptance release and archive-after release, then preserve them in TICKET_HISTORY.md. Pending and implemented-but-unaccepted work stays current.

## V1.0725 partial update and backend review

The 30 browser annotations are tracked in DEVELOPMENT.md. Partial releases use the requested suffix; do not promote to a full Update without owner direction. No additional tickets were closed by this pass. FISH-040 is removed; current game work belongs to FISH-039.

Backend evidence (October 18): all four public application tables have RLS; ownership policies constrain authenticated access; the file bucket is private; master and revision triggers exist and current snapshots match. The advisor flags leaked-password protection as disabled. No backend schema, permissions, credentials or private records were changed. A second account is required for FISH-030 live verification.

Continue remaining work in this order: FISH-030 live test once a tester is available; FISH-014 incremental renderer consolidation; FISH-005 alternate-host verification; FISH-009 source verification; FISH-034 media library; FISH-067 recipe/material matching; FISH-036 warranty flow; FISH-038 PWA; FISH-037 sharing; FISH-039 collection/growth. These remain planned work, not completed features.

## V1.073 maintenance update — October 25

Upload → Delete now checks local and freshly loaded cloud photo references, file ownership and account/client continuity. Attached photos must be removed from their section, fly or location before deletion. Both catalog handlers share the guard. Storage and catalog removal remain separate operations; cross-device changes cannot be made atomic by this client check.

Backend: four application tables retain RLS/ownership policies, private Storage and master/revision triggers. Current snapshot and file manifest match their source. Added `fishos_files_user_id_idx` through migration `fishos_v1073_file_owner_index`; index verified valid/ready and missing-foreign-key-index advisory resolved. New index is initially reported unused; no measured speedup claimed. Leaked-password protection remains disabled. No private records or policies changed. No new owner acceptance was recorded; pending tickets remain open.
