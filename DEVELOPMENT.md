# Fish OS V1.073 — maintenance update

October 25, 2026 (Pacific). A focused library and backend maintenance release. No new owner acceptance is inferred; the full media library and other planned features remain open.

## Changes

- Upload → catalog → Delete now refuses files selected as section covers, fly/location thumbnails or attached photos. It checks both local and freshly loaded cloud records and explains where to detach each selection.
- Both catalog generations use the same deletion helper. It verifies current catalog ownership, private bucket/path, account hydration and client/user continuity around asynchronous operations. Storage failures stop catalog deletion; partial cleanup is reported explicitly.
- Added backend index `fishos_files_user_id_idx` via migration `fishos_v1073_file_owner_index`. Verified valid/ready. The missing-foreign-key-index advisory is resolved; the fresh index is initially reported unused. No measured speedup is claimed for the small current catalog.
- Updated the public and in-app ticket ledgers and release identity, including navigation. Public-only hosting bundle now identifies V1.073.

## Backend verification

October 25 read-only checks confirmed all four application tables have RLS and ownership policies; Storage remains private; master/revision triggers exist; the current records snapshot and file manifest match their source. No private records, policies or credentials were changed. The only production schema change was the additive ownership index.

Leaked-password protection remains disabled: [Supabase remediation](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). Index-use monitoring: [unused-index guidance](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index).

## Verification and limits

149 synthetic regression tests pass, including 45 deletion cases; script syntax and static dependencies pass. Independent bounded code review found no blocking issues. Local signed-out Upload navigation was checked in the browser. Entry and V1.073 archive are identical. Existing archives and supporting assets are preserved (14 versioned HTML files currently retained; above the minimum retention target).

Storage and catalog removal remain separate operations. The guard cannot make cross-device edits atomic. Live two-account, photo/upload persistence, alternate-host login and actual iOS checks remain outstanding. No destructive production test was performed.
