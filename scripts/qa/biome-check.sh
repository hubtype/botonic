#!/bin/bash
# Script for pre-commit hook that runs Biome check
# - In CI (GitHub Actions): only verify (no --write)
# - In local: apply fixes automatically (--write)
# Uses the Biome version from the project's package-lock.json.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
BIOME="${ROOT_DIR}/node_modules/.bin/biome"

if [ ! -x "$BIOME" ]; then
  echo "Biome not found at ${BIOME}. Run 'npm ci' in the repository root." >&2
  exit 1
fi

if [ "${CI:-}" = "true" ]; then
  "$BIOME" check --diagnostic-level=error "$@"
else
  "$BIOME" check --write --diagnostic-level=error "$@"
fi
