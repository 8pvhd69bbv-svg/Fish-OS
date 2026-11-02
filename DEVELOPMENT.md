# Fish OS V1.076 — map renderer cleanup

November 1, 2026 (Pacific). Continued the next unblocked queue item FISH-014 after publishing V1.075. Migrated the map research-tools decorator from a render wrapper to the shared dispatcher. Existing map/pins are untouched; historical asset remains available. Added a long-note research fixture for layout checks.

V1.075's seven requested refinements remain in place. Live V1.075 HTML matched the published local release. Browser checked nonowner System order, icon transparency and Streets/Satellite switching with synthetic pins. Research source link starts 10px below long notes at the preview width.

Verification: 158 synthetic tests pass; 74 scripts parse; dependency audit passes; identical current/versioned HTML. Four new dispatcher regressions cover idempotence, route isolation, startup and map/pin identity. No backend data changes. FISH-014 remains partial; live two-account testing and owner acceptance remain outstanding.
