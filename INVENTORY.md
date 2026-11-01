# INVENTORY — ребрендинг (этап 0)

Состояние: ветка `rebrand`, ничего в коде не менялось. Охват: все файлы под git, кроме `reference/`, `reference-full/`, `baseline/`, `node_modules`, `.next`, `test-results/`, lock-файлов, шрифтов и скриншотов.

Логотипов Альфы и картинок с ней в `public/` нет: там только стандартные `file/globe/next/vercel/window.svg` и `favicon.ico` от create-next-app; в метаданных нет `icons`, `openGraph` и `manifest`. Alt-текстов с Альфой нет. Знак «Метроном» — это SVG-компонент `MetronomeGlyph`, а не логотип Альфы.

## A. Упоминания Альфы (67 строк)

Общий принцип замен: «Альфа-Банк» → «банк»; продукты → нейтральное описание.

| файл:строка | текущий текст | тип | предлагаемая замена |
| --- | --- | --- | --- |
| apps/metronom/README.md:1 | `# Metronome Alfa Final` | README | `# Metronome` |
| apps/metronom/README.md:3 | `Next.js 16 demo-prototype with mobile flows for Metronome inside Alfa Bank.` | README | `Next.js 16 demo-prototype with mobile flows for Metronome inside a bank app.` |
| apps/metronom/app/layout.tsx:6 | `description: "Интерактивный прототип AI-агента Метроном для финала Альфа-Банка 2026.",` | metadata | `description: "Интерактивный прототип AI-агента Метроном для финала 2026.",` |
| apps/metronom/components/metronome/prototype-app.tsx:268 | `<p className="screen-copy centered narrow">Введи логин и пароль от Альфа-Бизнес, чтобы открыть Метроном.</p>` | видимый текст | `<p className="screen-copy centered narrow">Введи логин и пароль от бизнес-кабинета банка, чтобы открыть Метроном.</p>` |
| apps/metronom/components/metronome/prototype-app.tsx:496 | `if (id === "alfa_account" \|\| id === "multibank") return <BankIcon />;` | внутренний идентификатор | — не менять |
| apps/metronom/components/metronome/prototype-app.tsx:538 | `<span>Счёт, эквайринг и СБП Альфы подключаются автоматически. Остальное включается по одному действию.</span>` | видимый текст | `<span>Счёт, эквайринг и СБП банка подключаются автоматически. Остальное включается по одному действию.</span>` |
| apps/metronom/components/metronome/prototype-app.tsx:679 | `cta: { label: "Подключить овердрафт Альфы", action: { type: "toast" as const, message: "Овердрафт доступен, но добавит платную долговую нагрузку уже в` | видимый текст | `cta: { label: "Подключить овердрафт банка", action: { type: "toast" as const, message: "Овердрафт доступен, но добавит платную долговую нагрузку уже в` |
| apps/metronom/components/metronome/prototype-app.tsx:1982 | `<span className="muted left-pad">Подготовлю перевод 18 000 ₽ на накопительный счёт Альфы.</span>` | видимый текст | `<span className="muted left-pad">Подготовлю перевод 18 000 ₽ на накопительный счёт банка.</span>` |
| apps/metronom/components/metronome/prototype-app.tsx:2018 | `<strong>Накопительный Альфы</strong>` | видимый текст | `<strong>Накопительный счёт банка</strong>` |
| apps/metronom/domain/events/reducer.ts:106 | `rationale: "Физически отделить 18 000 ₽ на накопительный счёт Альфы после отдельного подтверждения.",` | видимый текст | `rationale: "Физически отделить 18 000 ₽ на накопительный счёт банка после отдельного подтверждения.",` |
| apps/metronom/domain/events/reducer.ts:172 | `if (action.sourceId === "alfa_account") {` | внутренний идентификатор | — не менять |
| apps/metronom/domain/events/reducer.ts:173 | `const nextConnected = !(state.connectedSources.alfa_account && state.connectedSources.alfa_acquiring && state.connectedSources.alfa_sbp);` | внутренний идентификатор | — не менять |
| apps/metronom/domain/events/reducer.ts:178 | `alfa_account: nextConnected,` | внутренний идентификатор | — не менять |
| apps/metronom/domain/events/reducer.ts:179 | `alfa_acquiring: nextConnected,` | внутренний идентификатор | — не менять |
| apps/metronom/domain/events/reducer.ts:180 | `alfa_sbp: nextConnected,` | внутренний идентификатор | — не менять |
| apps/metronom/domain/types.ts:23 | `\| "alfa_account"` | внутренний идентификатор | — не менять |
| apps/metronom/domain/types.ts:24 | `\| "alfa_acquiring"` | внутренний идентификатор | — не менять |
| apps/metronom/domain/types.ts:25 | `\| "alfa_sbp"` | внутренний идентификатор | — не менять |
| apps/metronom/lib/demo/alternative-credit-history.ts:29 | `title: "Цикл пройден — доступен новый статус и четыре продукта Альфы",` | видимый текст | `title: "Цикл пройден — доступен новый статус и четыре продукта банка",` |
| apps/metronom/lib/demo/daily-cycle-scenarios.ts:214 | `name: "Подключить овердрафт Альфы",` | видимый текст | `name: "Подключить овердрафт банка",` |
| apps/metronom/lib/demo/daily-cycle-scenarios.ts:241 | `{ index: "3", name: "Овердрафт Альфы", meta: "Закроет разрыв, но создаёт стоимость при падающем потоке" },` | видимый текст | `{ index: "3", name: "Овердрафт банка", meta: "Закроет разрыв, но создаёт стоимость при падающем потоке" },` |
| apps/metronom/lib/demo/daily-cycle-scenarios.ts:324 | `sub: "Фиксируется через AlfaPOS — вручную отмечать не нужно.",` | видимый текст | `sub: "Фиксируется через кассу банка — вручную отмечать не нужно.",` |
| apps/metronom/lib/demo/daily-cycle-scenarios.ts:427 | `{ id: "alfa_credit", name: "Овердрафт или кредит Альфы", meta: "Быстро · платно · растёт долговая нагрузка при растущем потоке", tag: "Возможен" },` | видимый текст (id `alfa_credit` не менять) | `name: "Овердрафт или кредит банка"` |
| apps/metronom/lib/demo/fixtures.ts:202 | `alfaAccount: source("src_alfa_account", "bank_operation", "Счёт Альфы"),` | видимая подпись источника (ключ `alfaAccount`/`alfaAcquiring` и id `src_alfa_*` не менять) | `alfaAccount: source("src_alfa_account", "bank_operation", "Счёт банка"),` |
| apps/metronom/lib/demo/fixtures.ts:203 | `alfaAcquiring: source("src_alfa_acquiring", "bank_operation", "Эквайринг Альфы"),` | видимая подпись источника (ключ `alfaAccount`/`alfaAcquiring` и id `src_alfa_*` не менять) | `alfaAcquiring: source("src_alfa_acquiring", "bank_operation", "Эквайринг банка"),` |
| apps/metronom/lib/demo/fixtures.ts:214 | `alfa_account: true,` | внутренний идентификатор | — не менять |
| apps/metronom/lib/demo/fixtures.ts:215 | `alfa_acquiring: true,` | внутренний идентификатор | — не менять |
| apps/metronom/lib/demo/fixtures.ts:216 | `alfa_sbp: true,` | внутренний идентификатор | — не менять |
| apps/metronom/lib/demo/fixtures.ts:281 | `source: commonSources.alfaAccount,` | внутренний идентификатор | — не менять |
| apps/metronom/lib/demo/fixtures.ts:289 | `source: commonSources.alfaAcquiring,` | внутренний идентификатор | — не менять |
| apps/metronom/lib/demo/fixtures.ts:297 | `source: commonSources.alfaAcquiring,` | внутренний идентификатор | — не менять |
| apps/metronom/lib/demo/fixtures.ts:305 | `source: commonSources.alfaAcquiring,` | внутренний идентификатор | — не менять |
| apps/metronom/lib/demo/fixtures.ts:313 | `source: commonSources.alfaAcquiring,` | внутренний идентификатор | — не менять |
| apps/metronom/lib/demo/fixtures.ts:321 | `source: commonSources.alfaAcquiring,` | внутренний идентификатор | — не менять |
| apps/metronom/lib/demo/fixtures.ts:329 | `source: commonSources.alfaAcquiring,` | внутренний идентификатор | — не менять |
| apps/metronom/lib/gigachat/client.ts:77 | `"User-Agent": "metronome-alfa-final/0.1",` | идентификатор пакета (вопрос) | `"User-Agent": "metronome/0.1",` |
| apps/metronom/lib/gigachat/client.ts:118 | `"User-Agent": "metronome-alfa-final/0.1",` | идентификатор пакета (вопрос) | `"User-Agent": "metronome/0.1",` |
| apps/metronom/lib/industry/build-industry-view-model.ts:89 | `id: "alfa_account",` | внутренний идентификатор | — не менять |
| apps/metronom/lib/industry/build-industry-view-model.ts:90 | `title: "Счёт, эквайринг и СБП Альфы",` | видимый текст | `title: "Счёт, эквайринг и СБП банка",` |
| apps/metronom/lib/industry/build-industry-view-model.ts:92 | `connected: state.connectedSources.alfa_account && state.connectedSources.alfa_acquiring && state.connectedSources.alfa_sbp,` | внутренний идентификатор | — не менять |
| apps/metronom/lib/industry/profiles.ts:10 | `demoLogin: "coffee-to-go@alfabank-demo.ru",` | тестовые данные (вопрос) | `demoLogin: "coffee-to-go@bank-demo.example",` |
| apps/metronom/lib/industry/profiles.ts:17 | `sourceLabels: ["AlfaPOS / касса", "Склад", "Доставка"],` | видимый текст | `sourceLabels: ["Касса банка / POS", "Склад", "Доставка"],` |
| apps/metronom/lib/industry/profiles.ts:26 | `sourceHeading: "AlfaPOS / касса, склад и доставка",` | видимый текст | `sourceHeading: "Касса банка / POS, склад и доставка",` |
| apps/metronom/lib/industry/profiles.ts:46 | `demoLogin: "beauty@alfabank-demo.ru",` | тестовые данные (вопрос) | `demoLogin: "beauty@bank-demo.example",` |
| apps/metronom/lib/industry/profiles.ts:82 | `demoLogin: "retail@alfabank-demo.ru",` | тестовые данные (вопрос) | `demoLogin: "retail@bank-demo.example",` |
| apps/metronom/lib/industry/profiles.ts:89 | `sourceLabels: ["AlfaPOS / касса", "Склад", "WB / Ozon при наличии"],` | видимый текст | `sourceLabels: ["Касса банка / POS", "Склад", "WB / Ozon при наличии"],` |
| apps/metronom/lib/industry/profiles.ts:98 | `sourceHeading: "AlfaPOS, склад и маркетплейсы",` | видимый текст | `sourceHeading: "касса банка, склад и маркетплейсы",` |
| apps/metronom/package.json:2 | `"name": "metronome-alfa-final",` | идентификатор пакета (вопрос) | `"name": "metronome",` |
| apps/narodnye-investicii/package.json:2 | `"name": "alfa-kontur-doveria",` | идентификатор пакета (вопрос) | `"name": "kontur-doveria",` |
| apps/narodnye-investicii/src/app/campaigns/_components/CompensationScreen.tsx:22 | `<h1 className="text-h1 text-ink">Альфа компенсирует скидку</h1>` | видимый текст | `<h1 className="text-h1 text-ink">Банк компенсирует скидку</h1>` |
| apps/narodnye-investicii/src/app/campaigns/_components/StabilityFundScreen.tsx:48 | `Альфа оплатила «{entry.vendor}» напрямую — {formatRub(entry.amount)}` | видимый текст | `Банк оплатил «{entry.vendor}» напрямую — {formatRub(entry.amount)}` |
| apps/narodnye-investicii/src/app/layout.tsx:21 | `description: "Альфа-Банк — экосистема народных инвестиций для предпринимателей",` | metadata | `description: "Экосистема народных инвестиций для предпринимателей",` |
| apps/narodnye-investicii/src/app/rating/page.tsx:18 | `body: "Каждый продукт Альфы, который ты используешь (касса, приём платежей, эквайринг), — это дополнительные данные о бизнесе и плюс к рейтингу.",` | видимый текст | `body: "Каждый продукт банка, который ты используешь (касса, приём платежей, эквайринг), — это дополнительные данные о бизнесе и плюс к рейтингу.",` |
| apps/narodnye-investicii/src/lib/historyEntries.ts:46 | `title: `Альфа оплатила «${entry.vendor}» напрямую`,` | видимый текст | `title: `Банк оплатил «${entry.vendor}» напрямую`,` |
| apps/narodnye-investicii/src/lib/mockData.ts:10 | `products: ["Альфа-Касса", "Приём оплаты с телефона"],` | видимый текст | `products: ["Касса банка", "Приём оплаты с телефона"],` |
| apps/narodnye-investicii/src/lib/mockData.ts:47 | `viaProduct: "Альфа-Кассу",` | видимый текст | `viaProduct: "кассу банка",` |
| apps/narodnye-investicii/src/lib/mockData.ts:105 | `viaProduct: "СБП/терминал Альфы",` | видимый текст | `viaProduct: "СБП/терминал банка",` |
| apps/narodnye-investicii/src/lib/mockData.ts:130 | `products: ["Облачная касса", "Alfa Pay"],` | видимый текст | `products: ["Облачная касса", "Эквайринг банка"],` |
| apps/narodnye-investicii/src/lib/mockData.ts:165 | `viaProduct: "Alfa Pay",` | видимый текст | `viaProduct: "Эквайринг банка",` |
| apps/narodnye-investicii/src/lib/niches.ts:24 | `heading: "Альфа-Касса + приём с телефона",` | видимый текст | `heading: "Касса банка + приём с телефона",` |
| apps/narodnye-investicii/src/lib/niches.ts:25 | `products: [{ name: "Альфа-Касса", solid: true }, { name: "Приём оплаты с телефона", glyph: "📱" }],` | видимый текст | `products: [{ name: "Касса банка", solid: true }, { name: "Приём оплаты с телефона", glyph: "📱" }],` |
| apps/narodnye-investicii/src/lib/niches.ts:26 | `body: "В бьюти чаще всего платят картой прямо в кресле мастера — без кассы это касса «в тени». Альфа-Касса легализует расчёты, а приём с телефона убир` | видимый текст | `body: "В бьюти чаще всего платят картой прямо в кресле мастера — без кассы это касса «в тени». Касса банка легализует расчёты, а приём с телефона убир` |
| apps/narodnye-investicii/src/lib/niches.ts:34 | `heading: "Облачная касса + Alfa Pay",` | видимый текст | `heading: "Облачная касса + эквайринг банка",` |
| apps/narodnye-investicii/src/lib/niches.ts:35 | `products: [{ name: "Облачная касса", solid: true }, { name: "Alfa Pay", glyph: "💳" }],` | видимый текст | `products: [{ name: "Облачная касса", solid: true }, { name: "Эквайринг банка", glyph: "💳" }],` |
| apps/narodnye-investicii/src/lib/niches.ts:36 | `body: "После ухода с маркетплейса нужен свой канал приёма оплаты и учёта: облачная касса ведёт номенклатуру без привязки к одной точке продаж, а Alfa ` | видимый текст | `body: "После ухода с маркетплейса нужен свой канал приёма оплаты и учёта: облачная касса ведёт номенклатуру без привязки к одной точке продаж, а эквай` |
| apps/narodnye-investicii/src/lib/paymentProducts.ts:8 | `{ name: "Альфа-Касса", description: "Онлайн-касса для приёма оплаты по 54-ФЗ", glyph: "🧾" },` | видимый текст | `{ name: "Касса банка", description: "Онлайн-касса для приёма оплаты по 54-ФЗ", glyph: "🧾" },` |
| apps/narodnye-investicii/src/lib/paymentProducts.ts:11 | `{ name: "Alfa Pay", description: "Приём платежей на сайте и в соцсетях", glyph: "💳" },` | видимый текст | `{ name: "Эквайринг банка", description: "Приём платежей на сайте и в соцсетях", glyph: "💳" },` |

### Решения, которые нужны от вас
1. **Тестовые логины** `*@alfabank-demo.ru` (profiles.ts: 10, 46, 82) — это данные, которые подставляются в форму входа и сверяются e2e через `INDUSTRY_PROFILES`. Предлагаю `*@bank-demo.example`; логика не меняется, но значения сохранённого состояния не затрагиваются. Менять?
2. **Имена пакетов** (`metronome-alfa-final`, `alfa-kontur-doveria`) и `User-Agent` в `gigachat/client.ts` — не из вашего списка запретных. Смена имени пакета потребует правки `package-lock.json` (поле name) и, возможно, имени проекта в Vercel. Предлагаю `metronome` и `kontur-doveria`. Менять?
3. **Внутренние идентификаторы с «alfa»**, которые я не трону: значения `ConnectedSourceId` `alfa_account`, `alfa_acquiring`, `alfa_sbp` (types.ts, reducer.ts, fixtures.ts, build-industry-view-model.ts, prototype-app.tsx:496), ключи `alfaAccount`/`alfaAcquiring` и id `src_alfa_account`/`src_alfa_acquiring` в fixtures.ts, id `alfa_credit` в daily-cycle-scenarios.ts:427.
4. Видимая подпись «Счёт Альфы»/«Эквайринг Альфы» хранится в строке-аргументе `source(...)`; меняется только строка, а не id.

## B. Красные цвета

Роли: БРЕНД — заменяется на токены; СЕМАНТИКА — остаётся красным; «вопрос» — нужна ваша оценка.

| файл:строка | значение | где используется | роль |
| --- | --- | --- | --- |
| apps/metronom/app/globals.css:9 | `--accent: #ef3124` | токен: **один и тот же токен и для бренда, и для риска** (см. ниже) | БРЕНД, но токен общий |
| apps/metronom/app/globals.css:407 | `.eyebrow { color: var(--accent) }` | заголовочная плашка | БРЕНД |
| apps/metronom/app/globals.css:415 | `.eyebrow.red { color: var(--accent) }` | используется для «Как это работает» и «Правило» (prototype-app.tsx:1841, 1916) — не риск | БРЕНД |
| apps/metronom/app/globals.css:455 | `.profile-avatar { background: var(--accent) }` | аватар профиля | БРЕНД |
| apps/metronom/app/globals.css:610, 624 | `.inline-link`, `.logout-link` — `color: var(--accent)` | ссылки | БРЕНД |
| apps/metronom/app/globals.css:655 | `.field-card-error { inset 0 0 0 2px var(--accent) }` | рамка поля с ошибкой | СЕМАНТИКА |
| apps/metronom/app/globals.css:666 | `.inline-error { color: var(--accent) }` | текст ошибки | СЕМАНТИКА |
| apps/metronom/app/globals.css:740 | `.notification-dot { background: var(--accent) }` | точка уведомления | БРЕНД (вопрос: возможно, «внимание») |
| apps/metronom/app/globals.css:825 | `.metronome-card { background: var(--accent) }` | фирменная карточка | БРЕНД |
| apps/metronom/app/globals.css:900 | `.fact-card-kicker { color: var(--accent) }` | подпись | БРЕНД |
| apps/metronom/app/globals.css:1569–1570 | `.status-row-red` — `rgba(239,49,36,.08)` фон, `.12` рамка | строка статуса «риск» | СЕМАНТИКА |
| apps/metronom/app/globals.css:1598–1599 | `.status-dot.red` — `var(--accent)`, тень `rgba(239,49,36,.14)` | индикатор статуса бизнеса (рядом с «Есть риск») | СЕМАНТИКА |
| apps/metronom/app/globals.css:116, 121 | keyframes `credit-history-ring-pulse` — `rgba(239,49,36,.18/.08)` | пульс кольца кредитной истории | БРЕНД |
| apps/metronom/app/globals.css:1607 | `.credit-history-entry-card` — градиент `#1d1d1b → #4a2420` | тёмная карточка с красноватым оттенком | БРЕНД (декор; вопрос: заменить на тёмно-синий оттенок?) |
| apps/metronom/app/globals.css:1642, 1646 | `.credit-history-entry-dot / -kicker` — `var(--accent)` | точка и подпись | БРЕНД |
| apps/metronom/app/globals.css:1764 | `.free-label { color: var(--accent) }` | подпись «свободно» | БРЕНД |
| apps/metronom/app/globals.css:1861–1862 | `.scenario-entry-card-red` — `rgba(239,49,36,.32/.08)` | карточка сценария тона `red` (риск) | СЕМАНТИКА |
| apps/metronom/app/globals.css:2002 | `.scenario-status-badge-dark .scenario-status-badge-dot` — `var(--accent)` | точка в тёмном бейдже | БРЕНД |
| apps/metronom/app/globals.css:2006–2007 | `.scenario-status-badge-red` — фон `rgba(239,49,36,.12)`, текст `var(--accent)` | бейдж тона `red` | СЕМАНТИКА |
| apps/metronom/app/globals.css:2141 | `.scenario-action-card::after` — `rgba(239,49,36,.16)` | свечение карточки действия | БРЕНД |
| apps/metronom/app/globals.css:2153 | `.scenario-ladder-kicker` — `var(--accent)` | подпись | БРЕНД |
| apps/metronom/app/globals.css:2179, 2187 | `.scenario-screen-fundraise_recommend .scenario-action-card` — `#4a241f`, радиальный `rgba(239,49,36,.2/.08)` | карточка рекомендации | БРЕНД (декор; вопрос как у 1607) |
| apps/metronom/app/globals.css:2323 | `.scenario-compare-card-featured` — рамка `var(--accent)` | выделенная карточка | БРЕНД |
| apps/metronom/app/globals.css:2368 | `.scenario-compare-tag-featured` — `var(--accent)` | тег «Рекомендую» | БРЕНД |
| apps/metronom/app/globals.css:2381–2382 | `.scenario-warning` — фон `rgba(239,49,36,.12)`, текст `var(--accent)` | предупреждение | СЕМАНТИКА |
| apps/metronom/app/globals.css:2557 | `.scenario-ladder-index-accent` — `var(--accent)` | номер ступени | БРЕНД |
| apps/metronom/app/globals.css:2601 | `.scenario-secondary-link` — `var(--accent)` | ссылка | БРЕНД |
| apps/metronom/app/globals.css:2633 | `.credit-history-ring` — `conic-gradient(var(--accent)…)` | кольцо прогресса | БРЕНД |
| apps/metronom/app/globals.css:2683 | `.credit-history-status-sub` — `var(--accent)` | подпись | БРЕНД |
| apps/metronom/app/globals.css:2813 | `.credit-history-why-card` — `var(--accent)` | карточка | БРЕНД |
| apps/metronom/app/globals.css:2847, 2856 | `.audit-row + .audit-row` рамка `rgba(239,49,36,.22)`; `.audit-row-bullet` `var(--accent)` | журнал | БРЕНД |
| apps/metronom/app/globals.css:2888 | `.safe-updates-card` — `var(--accent)` | карточка | БРЕНД |
| apps/metronom/app/globals.css:2924 | `.safe-audit-next-check` — `var(--accent)` | подпись | БРЕНД |
| apps/metronom/app/globals.css:3259 | `.bottom-nav-item-active` — `var(--accent)` | активный пункт меню | БРЕНД |
| apps/metronom/app/globals.css:3358 | `.how-calculated-guide-line` — `stroke: var(--accent)` | линия графика | БРЕНД |
| apps/metronom/app/globals.css:3365 | `.how-calculated-point { fill: #ff3b30 }` | точка графика «как считается» (другой красный, не токен) | вопрос |
| apps/metronom/app/globals.css:3509 | `.limit-dot` — `var(--accent)` | точка у лимита резерва | вопрос (БРЕНД или предел/риск) |
| apps/metronom/app/globals.css:3574 | `.transfer-arrow` — `var(--accent)` | стрелка перевода | БРЕНД |
| apps/metronom/components/metronome/icons.tsx:7 | `MetronomeGlyph color = "#EF3124"` | знак «Метроном» по умолчанию | БРЕНД |
| apps/metronom/components/metronome/prototype-app.tsx:447 | `<MetronomeGlyph color="#ef3124" />` | знак | БРЕНД |
| apps/metronom/components/metronome/prototype-app.tsx:1285 | `armColor = "#EF3124"` в анимации обработки | стрелка метронома | БРЕНД |
| apps/metronom/components/metronome/prototype-app.tsx:1518 | `env_supplier`: `#ebb3a6` / `#df8f82` / `#fff0ec` | розовый оттенок конверта «поставщик» — часть палитры конвертов (жёлтый, бежевый, розовый), не бренд | вопрос (по умолчанию не трогаю) |
| apps/narodnye-investicii/src/app/globals.css:16 | `--red-500: #ef3124` | базовый токен; от него `--accent-red` (34) и `--color-red` (48) | БРЕНД, но токен общий |
| apps/narodnye-investicii/src/app/ai-assistant/_components/WalletSplitCard.tsx:6 | `taxes → "#EF3124"` | сегмент «Налоги» в диаграмме кошелька | вопрос (категория диаграммы или бренд) |
| apps/narodnye-investicii/src/app/sandbox/_components/CalculatingScreen.tsx:13 | `borderTopColor: var(--red-500)` | спиннер | БРЕНД |
| apps/narodnye-investicii/src/app/sandbox/_components/ResultScreen.tsx:52 | `"#EF3124"` для последнего сегмента шкалы риска (зелёный → жёлтый → красный) | уровень риска | СЕМАНТИКА |
| apps/narodnye-investicii/src/components/ui/TrustRatingRing.tsx:23 | `stroke="#EF3124"` | кольцо рейтинга доверия | БРЕНД |
| apps/narodnye-investicii/src/components/ui/Input.tsx:13, 23 | `ring-red`, `text-red` при `error` | ошибка поля | СЕМАНТИКА |
| apps/narodnye-investicii/src/app/ai-assistant/_components/RiskBanner.tsx:27 | `text-red` на ссылке «/crisis» в баннере риска | ссылка внутри риск-баннера | вопрос (скорее СЕМАНТИКА) |
| apps/narodnye-investicii/src/app/campaigns/_components/PaymentConfirmScreen.tsx:29 | `text-red` у «−{discountPercent}%» | скидка | вопрос (акцент или предупреждение) |
| apps/narodnye-investicii/src/app/crisis/_components/AltCreditUnlockScreen.tsx:9, PreviewScreen.tsx:26, DonorMonitorScreen.tsx:45 | `text-red` у плашек «Новый уровень» / «Пересматриваю стратегию» | подписи экранов кризиса | вопрос (БРЕНД-подпись или «кризис») |
| apps/narodnye-investicii/src/app/sandbox/_components/RecommendScreen.tsx:12, 21 | `text-red`, `bg-red text-white` | подпись и выбранный продукт | БРЕНД |
| apps/narodnye-investicii/src/app/sandbox/_components/AbacusAnimation.tsx:11 | `var(--accent-red)` | анимация | БРЕНД |
| apps/narodnye-investicii/src/app/ai-assistant/_components/BenchmarkCard.tsx:27 | `bg-red` | полоса сравнения | БРЕНД |
| apps/narodnye-investicii/src/app/campaigns/_components/CampaignCard.tsx:18; campaigns/[id]/page.tsx:105 | `text-red` | тип сбора | БРЕНД |
| apps/narodnye-investicii/src/app/legal/_components/CardDetailScreen.tsx:12; SearchScreen.tsx:80; components/ui/LegalContextPopup.tsx:27 | `text-red` | категория карточки | БРЕНД |
| apps/narodnye-investicii/src/app/onboarding-intro/_components/GrowthAnimation.tsx:16; TicketAnimation.tsx:10; OrbitAnimation.tsx:7 | `var(--accent-red)` | анимации онбординга | БРЕНД |
| apps/narodnye-investicii/src/app/onboarding/_components/TariffScreen.tsx:32 | `bg-red text-white` | бейдж тарифа | БРЕНД |
| apps/narodnye-investicii/src/components/ui/BottomNav.tsx:27, 28 | `bg-red`, `text-red` | активный пункт меню | БРЕНД |

### Важное для этапа 1
- В Метрономе **один токен `--accent` обслуживает и бренд, и семантику**: `.field-card-error`, `.inline-error`, `.status-row-red`, `.status-dot.red`, `.scenario-entry-card-red`, `.scenario-status-badge-red`, `.scenario-warning` читают `--accent` или его rgba. Чтобы они остались красными, нужен новый токен `--danger: #ef3124` для них; это правка значений в CSS, а не логики.
- В НИ классы `text-red`/`bg-red`/`ring-red` идут от `--color-red` → `--red-500`. Для ошибок (`Input.tsx`) придётся ввести отдельный `--danger`, иначе они станут синими вместе с брендом.
- Оттенки серо-красных тёмных градиентов (`#4a2420`, `#4a241f`) и розовый `#ebb3a6` — декоративные, прошу решить, как их трактовать.
- Красный, который останется: ошибки полей, статусы риска и «Есть риск», предупреждения, сегмент риска в `ResultScreen`.

### Вопросы по цвету (жду решения)
1. `.how-calculated-point` `#ff3b30` — брендовый акцент или маркер?
2. `.limit-dot`, `.notification-dot` — бренд?
3. `RiskBanner` ссылка, скидка «−N%», подписи кризисных экранов — оставить красными (семантика) или перекрасить?
4. Диаграмма «Налоги» (`WalletSplitCard`) — категория диаграммы или бренд?
5. Тёмные карточки с красноватым градиентом и розовый конверт «поставщик» — перекрасить в тёмно-синий / оставить?
