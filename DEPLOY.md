# Деплой на Vercel

Метроном (`/`) и «Народные инвестиции» (`/ni`) — **одно Next-приложение** в `apps/narodnye-investicii`:
один Vercel-проект, один домен, без прокси и переадресаций.

## Устройство

- `src/app/(metronom)/` — корневой layout Метронома (маршруты `/`, `/login`, `/campaign-handoff` и т. д. через catch-all `[...slug]`), код — в `src/metronom/` (алиас `@m/*`).
- `src/app/(ni)/ni/` — «Народные инвестиции» под префиксом `/ni`, свой корневой layout, Tailwind и шрифты. Стили зон не пересекаются: у каждой группы свой корневой layout и свой CSS.
- `src/app/api/gigachat/` — API Метронома.
- Передача сбора между зонами идёт через `localStorage` (`handoff:campaign-closed`) на одном origin.

## Проект на Vercel

- Root Directory: `apps/narodnye-investicii`
- Framework: Next.js, Install: `npm ci`, Build: `npm run build`
- Environment Variables (Production и Preview):

| Переменная | Значение |
| --- | --- |
| `NEXT_PUBLIC_LLM_MODE` | `auto` |
| `GIGACHAT_AUTH_KEY` | только если нужны живые ответы GigaChat |
| `GIGACHAT_SCOPE` | `GIGACHAT_API_PERS` |
| `GIGACHAT_MODEL` | `GigaChat-3-Ultra` |

`NI_ORIGIN` и `METRONOM_ORIGIN` больше не нужны — их можно удалить. Отдельный проект Метронома (`metronom-final`) тоже не нужен.

## Проверка после деплоя

- `/` — Метроном, `/campaign-handoff` — экран приёмки;
- `/ni`, `/ni/campaigns` — НИ; `/ni/что-угодно` — 404;
- закрыть сбор в `/ni/campaigns/<id>` → приёмка → подтверждение → главная Метронома.

## Локально

```bash
cd apps/narodnye-investicii
npm ci
npm run dev        # http://localhost:3000
npm run lint && npm run typecheck && npm run test && npm run build
npm run test:e2e   # поднимает dev-сервер на 127.0.0.1:3000
```

## Заметки

- `reactStrictMode: false` в `next.config.ts`: в dev двойной запуск эффектов затирает сохранённое состояние НИ (`AppStateProvider`). На проде этого нет.
- `typecheck` гоняет две конфигурации: обычную и строгую `tsconfig.metronom.json` для кода Метронома (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`).
- Жёстко зашитые демо-данные (`850 000 ₽` в `src/metronom/lib/industry/profiles.ts`, стартовые суммы в `src/metronom/lib/demo/fixtures.ts`) — прототип, а не ошибка деплоя.
