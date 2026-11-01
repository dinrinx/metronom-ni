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

## Stage 6 — final verification (2026-11-01)

| Application | Command | Result |
| --- | --- | --- |
| Metronom | `npm run lint` | PASS |
| Metronom | `npm run typecheck` | PASS |
| Metronom | `npm run test` | PASS — 3 files, 16 tests (было 1 файл, 10 тестов) |
| Metronom | `npm run test:e2e` | PASS — 6 tests на прогретом dev-сервере (см. flaky ниже) |
| Metronom | `npx playwright test -c playwright.zones.config.ts` | PASS — новый сквозной сценарий НИ → приёмка → главная (обе зоны) |
| Народные инвестиции | `npm run lint` | PASS |
| Народные инвестиции | `npx tsc --noEmit` | PASS |

### Screenshots vs baseline

Новые скриншоты: `baseline/screens/stage6/`.

- `metronom-home.png` — побайтно идентичен baseline.
- `narodnye-investicii-home.png` — отличается: baseline снят до отрисовки (пустой экран телефона), сейчас виден «Шаг 1 из 3». Это дефект исходного снимка, а не регрессия; сам baseline не перезаписывался. Теперь страница доступна по `/ni`.

### Known flaky (не от наших изменений)

При холодном старте dev-сервера первый тест `p0.spec.ts` может упасть на `login-input` (значение сбрасывается до гидратации). Воспроизводится и на коммите `67909935` (до этапа 2). После прогрева сервера проходят все 6.

### Notes

- `npm run build` НИ по-прежнему падает на загрузке Google Fonts из baseline (не чинилось).
- Сквозной тест идёт на `localhost`, а не `127.0.0.1`: на `127.0.0.1` НИ за rewrites не гидратируется в dev.

### Follow-ups (2026-11-01)

- `campaignCommittedSlice` теперь пересчитывается при приёмке сбора (= сумма наград бэкерам).
- Адрес зоны НИ в rewrites берётся из `NI_ORIGIN` (по умолчанию `http://localhost:3001`, см. `apps/metronom/.env.example`); корневой `npm run dev` понимает `METRONOM_PORT`, `NI_PORT`, `NI_ORIGIN`.
- НИ при эмите передаёт `quantity = supportersCount` для каждой награды; срок и себестоимость в данных НИ отсутствуют и по-прежнему вводятся вручную.
- В НИ добавлен `allowedDevOrigins: ["127.0.0.1"]`: сквозной e2e теперь идёт на `127.0.0.1`, профиль выбирается кликом в интерфейсе НИ, без подмены `localStorage`.
- `npm run build` НИ проходит (шрифты Golos Text подключены локально, замена на Google Fonts не понадобилась).
