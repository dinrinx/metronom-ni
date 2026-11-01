# GigaChat × Vercel smoke test

Минимальный диагностический стенд для проверки GigaChat API из Vercel. Он последовательно проверяет:

1. запуск серверного Next.js route;
2. наличие секретов в environment variables;
3. TLS-соединение через доверенные сертификаты НУЦ Минцифры и получение OAuth-токена;
4. запрос к выбранной модели GigaChat.

Ключ авторизации и access token никогда не возвращаются в браузер.

Сертификаты добавлены только в отдельный HTTPS-клиент GigaChat. Проверка TLS
остаётся включённой, а глобальная политика безопасности Node.js не меняется.

## 1. Получить ключ

Создай проект GigaChat API в кабинете Sber Developers и скопируй **Authorization key**. Для физлица используется scope `GIGACHAT_API_PERS`.

## 2. Проверить локально

```bash
cp .env.example .env.local
npm install
npm run dev
```

Заполни в `.env.local` только `GIGACHAT_AUTH_KEY`. Открой `http://localhost:3000` и нажми «Запустить тест».

## 3. Задеплоить на Vercel

1. Загрузи папку в GitHub.
2. В Vercel нажми **Add New → Project** и выбери репозиторий.
3. Root Directory укажи `gigachat-vercel-smoke-test`, если папка лежит внутри общего репозитория.
4. В **Settings → Environment Variables** добавь:
   - `GIGACHAT_AUTH_KEY` — Authorization key;
   - `GIGACHAT_SCOPE` — `GIGACHAT_API_PERS`;
   - `GIGACHAT_MODEL` — `GigaChat-3-Ultra`.
5. Добавляй значения для Production, Preview и Development.
6. Нажми Deploy. После добавления или изменения переменных обязательно сделай Redeploy.

## Как читать результат

- **MISSING_GIGACHAT_AUTH_KEY** — секрет не добавлен в deployment.
- **OAUTH_REJECTED** — неверный Authorization key или scope.
- **TLS_CERTIFICATE_ERROR** — сертификаты не попали в сборку или GigaChat обновил цепочку; проверь актуальную документацию сертификатов.
- **GENERATION_REJECTED** — OAuth работает, но модель/квота/параметры запроса отклонены.
- **Соединение работает** — полный путь Vercel → OAuth → GigaChat успешно пройден.

Если Ultra недоступна ключу, поменяй только `GIGACHAT_MODEL` на `GigaChat-2-Max` и сделай Redeploy.

## Важно

Не добавляй `.env.local` в Git и не вставляй Authorization key в клиентский код. Не отключай TLS через `NODE_TLS_REJECT_UNAUTHORIZED=0`: стенд использует безопасный отдельный CA-контур.
