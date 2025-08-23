#!/bin/bash

echo "🔍 Проверка загрузки ресурсов на Cloudflare..."

BASE_URL="https://practice-energy-production.proton-1b3.workers.dev"

echo "📄 Проверка главной страницы..."
curl -s -o /dev/null -w "Главная страница: %{http_code}\n" "$BASE_URL/"

echo "🎨 Проверка CSS файлов..."
CSS_FILES=$(curl -s "$BASE_URL/" | grep -o '_next/static/css/[^"]*\.css' | head -5)
for css in $CSS_FILES; do
    echo css
    curl -s -o /dev/null -w "CSS $css: %{http_code}\n" "$BASE_URL/$css"
done

echo "📜 Проверка JS файлов..."
JS_FILES=$(curl -s "$BASE_URL/" | grep -o '_next/static/chunks/[^"]*\.js' | head -5)
for js in $JS_FILES; do
    echo js
    curl -s -o /dev/null -w "JS $js: %{http_code}\n" "$BASE_URL/$js"
done

echo "✅ Проверка завершена!"
