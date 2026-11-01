#!/usr/bin/env bash
# Сторож ребрендинга: можно менять тексты, цвета и картинки, нельзя менять логику.
# Сравнивает рабочую папку с тегом (по умолчанию integration).
set -uo pipefail
BASE="${1:-integration}"
REF="refs/tags/$BASE"

# Файлы, которые нельзя менять совсем
FROZEN=(
  "apps/metronom/domain/finance/*"
  "apps/metronom/domain/policy/*"
  "apps/metronom/domain/types.ts"
  "apps/metronom/lib/navigation/step-paths.ts"
  "apps/*/next.config.ts"
  "apps/*/package.json"
  "apps/*/package-lock.json"
  "apps/*/tsconfig.json"
  "scripts/*"
  ".githooks/*"
)
# Файлы, которые можно удалять
DELETABLE=(
  "apps/*/public/*"
)
# В остальных файлах каждая УДАЛЯЕМАЯ строка должна содержать бренд или цвет
PATTERN='Альф|альф|АЛЬФ|alfa|Красн|красн|(^|[^a-z])red([^a-z]|$)|red-[0-9]|#[0-9a-f]{3,8}|rgba?\(|hsla?\(|--[a-z0-9-]*(color|accent|primary|brand|red)'

if ! git rev-parse -q --verify "$REF" >/dev/null; then
  echo "Нет тега $BASE. Создай его: git tag $BASE"; exit 2
fi
if ! STATUS=$(git diff --no-renames --name-status "$REF" --); then
  echo "ОШИБКА: git diff не отработал, сторож ничего не проверил."; exit 2
fi
echo "Файлов в diff относительно $BASE: $(printf '%s\n' "$STATUS" | grep -c .)"

matches() { # путь, массив масок
  local p="$1"; shift; local pat
  for pat in "$@"; do [[ "$p" == $pat ]] && return 0; done
  return 1
}

fail=0
while IFS=$'\t' read -r st path; do
  [ -z "${path:-}" ] && continue
  [ "$st" = "A" ] && continue
  if matches "$path" "${FROZEN[@]}"; then
    echo "❌ $path — файл заморожен, менять нельзя"; fail=1; continue
  fi
  if [ "$st" = "D" ]; then
    if matches "$path" "${DELETABLE[@]}"; then echo "✅ $path — удалён (картинка)"
    else echo "❌ $path — удалять нельзя"; fail=1; fi
    continue
  fi
  bad=$(git diff -U0 --no-renames "$REF" -- "$path" | grep -E '^-' | grep -vE '^---' | sed 's/^-//' | grep -viE "$PATTERN" || true)
  if [ -n "$bad" ]; then
    n=$(printf '%s\n' "$bad" | grep -c .)
    echo "❌ $path — удалено $n строк без бренда и цвета (похоже на правку логики):"
    printf '%s\n' "$bad" | head -3 | cut -c1-110 | sed 's/^/     − /'
    fail=1
  else
    echo "✅ $path"
  fi
done <<< "$STATUS"

if [ $fail -eq 1 ]; then
  echo; echo "СТОП: есть правки вне разрешённого. Откати файл: git checkout $REF -- <путь>"; exit 1
fi
echo; echo "Всё в рамках правил ребрендинга."
