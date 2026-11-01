# Baseline — 2026-11-01

## Environment

Dependencies were restored because `node_modules` is not tracked:

```sh
(cd apps/metronom && npm install)
(cd apps/narodnye-investicii && npm install)
```

Both commands completed successfully. `apps/metronom` emitted a deprecation warning for `whatwg-encoding@3.1.1`; `apps/narodnye-investicii` emitted no warnings.

## Verification

| Application | Command | Result |
| --- | --- | --- |
| Metronom | `npm run lint` | PASS |
| Metronom | `npm run typecheck` | PASS |
| Metronom | `npm run test` | PASS — 1 file, 10 tests |
| Metronom | `npm run test:e2e` | PASS — 6 tests (run with permission to bind the local dev server) |
| Народные инвестиции | `npm run lint` | PASS |
| Народные инвестиции | `npm run build` | FAIL — `next/font` could not fetch `Golos Text` from `https://fonts.googleapis.com`; Turbopack aborted the build. |

## Baseline caveats

- The first sandboxed `npm run test:e2e` attempt could not bind `127.0.0.1:3000` (`EPERM`). The same command passed when local server binding was permitted; this is an execution-sandbox limitation, not a source failure.
- `npm run build` for Народные инвестиции failed before any product changes because the Google Fonts request could not establish a connection. It was not fixed in this stage.

## Screenshots

Playwright screenshots of the main screens (Desktop Chrome, full page):

- `baseline/screens/metronom-home.png` — 1280×720
- `baseline/screens/narodnye-investicii-home.png` — 1280×892
