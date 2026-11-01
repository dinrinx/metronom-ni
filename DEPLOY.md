# Деплой на Vercel

Один домен, две зоны (Multi-Zones): Метроном на `/`, «Народные инвестиции» (НИ) на `/ni`.
В Vercel это **два проекта** из одного репозитория.

## 1. Проект НИ (создаётся первым)

- Root Directory: `apps/narodnye-investicii`
- Framework: Next.js (определяется сам), Install: `npm ci`, Build: `npm run build`
- Переменных окружения нет.
- `basePath: "/ni"` уже в `next.config.ts`, так что страницы и `/ni/_next/...` отдаются под `/ni`.
- Домен проекта по умолчанию (`<имя>.vercel.app`) нужен только как адрес для Метронома, пользователям его не показываем.

## 2. Проект Метронома (основной, на нём пользовательский домен)

- Root Directory: `apps/metronom`
- Framework: Next.js, Install: `npm ci`, Build: `npm run build`
- Environment Variables (Production и Preview):

| Переменная | Значение |
| --- | --- |
| `NI_ORIGIN` | URL проекта НИ, например `https://narodnye-investicii.vercel.app` (без `/ni` и без `/` на конце) |
| `NEXT_PUBLIC_LLM_MODE` | `auto` |
| `GIGACHAT_AUTH_KEY` | только если нужны живые ответы GigaChat |
| `GIGACHAT_SCOPE` | `GIGACHAT_API_PERS` |
| `GIGACHAT_MODEL` | `GigaChat-3-Ultra` |

- `NI_ORIGIN` читается **на сборке** (rewrites запекаются в билд). Поменяли значение — пересоберите проект Метронома. Без него сборка на Vercel падает с понятной ошибкой.
- Пользовательский домен привязывайте только к проекту Метронома.

## 3. Порядок

1. Задеплоить НИ, скопировать его URL.
2. Прописать `NI_ORIGIN` в Метрономе и задеплоить его.
3. Проверить:
   - `https://<домен>/` — Метроном;
   - `https://<домен>/ni` и `/ni/campaigns` — НИ со стилями и шрифтами;
   - закрыть сбор в `/ni/campaigns/<id>` → редирект на `/campaign-handoff` → подтверждение → главная Метронома.

## 4. Важно знать

- Передача данных между зонами идёт через `localStorage` (`handoff:campaign-closed`), поэтому зоны обязаны открываться с **одного домена**. На разных поддоменах и `*.vercel.app` каждой зоны данные не передадутся.
- Переходы между зонами — только через `window.location`, не `next/link`.
- Preview-деплои: `NI_ORIGIN` для Preview можно указать на preview-URL НИ той же ветки.
- Локальная проверка как на проде: `npm run build` в обеих папках, затем `next start -p 3001` в НИ и `NI_ORIGIN=http://localhost:3001 next start -p 3000` в Метрономе.
- Жёстко зашитые демо-данные (`850 000 ₽` в `lib/industry/profiles.ts` и стартовые суммы в `lib/demo/fixtures.ts`) — это прототип, а не баг деплоя.
- Устаревшее в `apps/metronom/README.md`: «Keep the root directory as the repository root» — теперь Root Directory задаётся для каждого проекта отдельно, как выше.
