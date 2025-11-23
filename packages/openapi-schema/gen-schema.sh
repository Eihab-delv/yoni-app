#!/usr/bin/env bash

set -euo pipefail

API_VERSION=$(tr -d '\n' <.api-version)
# URL="http://127.0.0.1:5001/dev/us-central1/api/v1/openapi?api_key=example_api_key"
URL="https://api-uc.a.run.app/v1/openapi?api_key=example_api_key"
OUT_DIR="./src/${API_VERSION}"
OUT_FILE="${OUT_DIR}/index.ts"
INDEX_FILE="./src/index.ts"

echo "Checking if OpenAPI server is running..."

if ! curl --silent --fail --head "$URL" >/dev/null; then
  echo "❌ Error: OpenAPI server is not running or not reachable at:"
  echo "   $URL"
  echo "Aborting."
  exit 1
fi

echo "✅ Server is up! Generating TypeScript types to $OUT_FILE..."

mkdir -p "$OUT_DIR"

if npx openapi-typescript "$URL" -o "$OUT_FILE"; then
  echo "✅ Successfully generated $OUT_FILE"
else
  echo "❌ openapi-typescript failed."
  exit 1
fi

echo "Updating $INDEX_FILE to export all versions..."

# Find all subdirectories in src/ that match v* (e.g., v1, v2, v7, etc.)
EXPORTS=""
for dir in ./src/v*/; do
  version=$(basename "$dir")
  EXPORTS+="export * as ${version} from \"./${version}\";\n"
done

# Write all exports to index.ts
printf "$EXPORTS" >"$INDEX_FILE"
echo "✅ Updated $INDEX_FILE"
