# Static hosting and recovery

Build a public-only deployment folder with `node scripts/package-site.mjs .local/site-v1.0725`. The destination must be new. The script includes only index.html and public assets/icons, writes a SHA-256 manifest and excludes repository history, local tooling, handoffs and private inputs. Host the resulting folder at a domain root or subdirectory; app navigation uses URL fragments and assets use relative paths.

Before changing the live host, add its exact HTTPS URL to the existing Supabase Auth redirect allowlist. Keep the current URL during a transition. Verify sign-in, sign-out, refresh/hydration and private photo downloads with a test account before switching DNS. An offline bundle does not contain private records or photos, and still requires the existing backend and external SDK/font/map providers. No backend keys with privileged access belong in a frontend bundle.

Use Upload's existing portable backup downloads for private records, revision history and file bytes. Keep them outside this repository. `scripts/backup-verify.mjs` checks a sealed private backup; `scripts/restore-smoke.mjs` rehearses record recovery offline. A successful static bundle is not a backend migration or a complete private-data backup.
