#!/usr/bin/env bash
# Сторож: сравнивает текущее состояние с тегом baseline.
# Новые файлы — можно. Существующие — только из списка ниже и с лимитом удалённых строк.
set -uo pipefail
BASE="${1:-baseline}"

# путь | сколько строк максимум можно удалить (0 = только добавлять)
ALLOWED=(
  "apps/metronom/next.config.ts|10"
  "apps/metronom/domain/types.ts|0"
  "apps/metronom/lib/navigation/step-paths.ts|0"
  "apps/metronom/domain/events/reducer.ts|0"
  "apps/metronom/components/metronome/prototype-app.tsx|3"
  "apps/narodnye-investicii/next.config.ts|10"
  "apps/narodnye-investicii/src/app/campaigns/[id]/page.tsx|0"
  "apps/metronom/package-lock.json|999999"
  "apps/narodnye-investicii/package-lock.json|999999"
  ".gitignore|0"
)

if ! git rev-parse -q --verify "refs/tags/$BASE" >/dev/null; then
  echo "Нет тега $BASE. Создай его: git tag $BASE"; exit 2
fi

fail=0; checked=0
while IFS=$'\t' read -r add del path; do
  [ -z "${path:-}" ] && continue
  git cat-file -e "$BASE:$path" 2>/dev/null || continue   # новый файл — пропускаем
  checked=1
  limit=""
  for rule in "${ALLOWED[@]}"; do
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
done < <(git diff --no-renames --numstat "$BASE")

[ $checked -eq 0 ] && echo "Существующие файлы не менялись."
if [ $fail -eq 1 ]; then
  echo; echo "СТОП: изменены файлы вне разрешённого списка. Откати их: git checkout $BASE -- <путь>"
  exit 1
fi
echo; echo "Всё в рамках правил."
