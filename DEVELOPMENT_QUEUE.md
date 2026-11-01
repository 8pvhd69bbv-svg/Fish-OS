# FISH OS — Development Queue

Updated 2026-11-01. This is an **ordered planning queue for ChatGPT development sessions**, not an automatic background worker or a ChatGPT UI Queue control. Tickets and acceptance statuses remain authoritative in [OPEN_TICKETS.md](OPEN_TICKETS.md); project facts and guardrails live in [PROJECT_STATE.md](PROJECT_STATE.md).

## Operating rules

1. Begin each development session by reading PROJECT_STATE.md, OPEN_TICKETS.md, DEVELOPMENT.md and this queue; inspect current code.
2. Select the highest-priority **unblocked** entry. Only implement a ticket when instructed in an active ChatGPT conversation; adding it here does not schedule or execute work.
3. If blocked, record the blocker, skip to the next ready item, and do **not** mark it completed.
4. Work on one focused ticket/subtask at a time. Before calling it complete, run relevant checks and report code changes, tests, gaps, and required owner acceptance.
5. Update this queue with evidence, and update corresponding ticket and project documentation in the same commit. Never close a ticket without owner acceptance.
6. User messages can reorder the queue. ChatGPT's native **Steer** applies only to an active compatible run; writing here does not activate it. New conversations normally use **Send**. No automatic cross-chat execution or background progression is implied.

## Backend-first queue

| Priority | Ticket | Scope / next action | Queue state |
|---|---|---|---|
| 1 | FISH-030 | Live second-user auth, upload, RLS isolation and cross-device tests | **BLOCKED** — second test account/person needed; do not synthesize production proof |
| 2 | FISH-014 | Incremental legacy renderer consolidation, preserving account/import/backup/trip behavior | **NEXT READY** — tackle smallest isolated wrapper group and regressions |
| 3 | FISH-005 | Verify alternate-host deployment and sign-in without disrupting production | **WAITING** — requires safe alternate-host/test authorization |
| 4 | FISH-013 | Confirm persistence/isolation in live two-account test | **BLOCKED** — depends on FISH-030; existing synthetic checks reported |
| 5 | FISH-015 | Review and obtain acceptance of master/revision/manifest parity evidence | **REVIEW** — implementation reported, acceptance pending |
| 6 | FISH-026 | Review recovery checks, backup export, and parity; document limitations | **REVIEW** — implementation reported, acceptance pending |
| 7 | FISH-017 | Review ambiguous historical records and reconciliation; avoid destructive merges | **REVIEW** — owner acceptance pending |
| 8 | FISH-029 | Live branded-login usability review | **WAITING** — live tester review |
| 9 | FISH-009 | Verify private research provenance before country-page integration | **BLOCKED** — source verification needed |
| 10 | FISH-034 | Plan and incrementally build private photo/video catalog, viewer and upload | **PLANNED** — media/data safety first |
| 11 | FISH-067 | Link recipes to owned material quantities | **PLANNED** |
| 12 | FISH-036 | Gear warranty wizard | **PLANNED** |
| 13 | FISH-038 | PWA feasibility, installability and offline/data-safety design | **PLANNED** |
| 14 | FISH-037 | Permission-controlled friend codes/sharing/messaging | **PLANNED** — security design required |
| 15 | FISH-039 | Stillwater collection and growth | **PLANNED** |

Other pending work stays in OPEN_TICKETS.md and can be promoted by user priority. The queue order does not change existing ticket status.

## Task template

**Ticket:** FISH-###  
**Goal:** specific bounded change  
**Prerequisites/blockers:** ...  
**Files/systems affected:** ...  
**Acceptance checks:** ...  
**Actual verification:** Not started / tested with evidence / live verified  
**Owner decision:** Pending / accepted / rejected  
**Next action:** ...

## Conversation commands (plain-language conventions, not native app controls)

- **Queue FISH-### after FISH-###** — request an ordered update to this file.
- **Prioritize backend** — keep reliability/security/data integrity above optional features.
- **Work on next ready ticket** — inspect the queue and implement the first safe, unblocked subtask in the active session.
- **Skip FISH-### because ...** — record a blocker; retain the ticket.
- **Show queue status** — read the committed queue and authoritative tickets, then summarize.
- **Steer: ...** — change instructions for the current conversation/task only when a compatible running task exists; otherwise send as a normal message.

## Change log

- 2026-11-01: Created ChatGPT-first development queue. Prioritized backend and data integrity; marked required human/live verification as blocked or awaiting review. No application code, live data, or acceptance states changed.
