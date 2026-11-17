#!/bin/sh
# Copies the app's pure report engine and content into this service so the emailed PDF is built by exactly the same logic as the app.
set -e
cd "$(dirname "$0")"
rm -rf engine && mkdir -p engine/engine engine/content
cp ../src/engine/*.ts engine/engine/
cp ../src/content/*.ts engine/content/
echo "engine synced"
