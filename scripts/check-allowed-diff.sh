#!/usr/bin/env bash
# Сторож: сравнивает текущее состояние с тегом baseline.
# Новые файлы — можно. Существующие — только из списка ниже и с лимитом удалённых строк.
set -uo pipefail
BASE="${1:-baseline}"
REF="refs/tags/$BASE"

# путь | сколько строк максимум можно удалить (0 = только добавлять)
ALLOWED=(
  # точки подключения
  "apps/metronom/playwright.config.ts|0"
  "apps/metronom/tests/e2e/helpers.ts|5"
  "apps/narodnye-investicii/src/app/layout.tsx|4"
  "apps/metronom/next.config.ts|10"
  "apps/metronom/domain/types.ts|1"
  "apps/metronom/lib/demo/daily-cycle-scenarios.ts|3"
  "apps/metronom/lib/navigation/step-paths.ts|0"
  "apps/metronom/domain/events/reducer.ts|0"
  "apps/metronom/components/metronome/prototype-app.tsx|3"
  "apps/narodnye-investicii/next.config.ts|10"
  "apps/narodnye-investicii/src/app/campaigns/[id]/page.tsx|0"
  ".gitignore|0"
  # сам сторож: правка видна в выводе отдельной строкой
  "scripts/check-allowed-diff.sh|999999"
  # файлы, которые Next и npm переписывают сами
  "apps/metronom/AGENTS.md|999999"
  "apps/metronom/CLAUDE.md|999999"
  "apps/metronom/next-env.d.ts|999999"
  "apps/metronom/tsconfig.json|3"
  "apps/metronom/package-lock.json|999999"
  "apps/narodnye-investicii/AGENTS.md|999999"
  "apps/narodnye-investicii/CLAUDE.md|999999"
  "apps/narodnye-investicii/next-env.d.ts|999999"
  "apps/narodnye-investicii/tsconfig.json|3"
  "apps/narodnye-investicii/package-lock.json|999999"
)

if ! git rev-parse -q --verify "$REF" >/dev/null; then
  echo "Нет тега $BASE. Создай его: git tag $BASE"; exit 2
fi

if ! DIFF=$(git diff --no-renames --numstat "$REF" --); then
  echo "ОШИБКА: git diff не отработал, сторож не может ничего проверить."; exit 2
fi
echo "Файлов в diff относительно $BASE: $(printf '%s\n' "$DIFF" | grep -c .)"

fail=0; checked=0
while IFS=$'\t' read -r add del path; do
  [ -z "${path:-}" ] && continue
  git cat-file -e "$REF:$path" 2>/dev/null || continue
  checked=1
  limit=""
  for rule in "${ALLOWED[@]}"; do
    case "$rule" in \#*) continue;; esac
    [ "${rule%%|*}" = "$path" ] && limit="${rule##*|}"
  done
  if [ ! -e "$path" ]; then
    echo "❌ $path — файл удалён"; fail=1
  elif [ -z "$limit" ]; then
    echo "❌ $path — этот файл трогать нельзя (+$add −$del)"; fail=1
  elif [ "$del" != "-" ] && [ "$del" -gt "$limit" ]; then
    echo "❌ $path — удалено строк: $del, можно максимум $limit"; fail=1
  else
    echo "✅ $path (+$add −$del)"
  fi
done <<< "$DIFF"

[ $checked -eq 0 ] && echo "Существующие файлы не менялись."
if [ $fail -eq 1 ]; then
  echo; echo "СТОП: изменены файлы вне разрешённого списка. Откати их: git checkout $REF -- <путь>"
  exit 1
fi
echo; echo "Всё в рамках правил."
