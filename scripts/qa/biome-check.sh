#!/bin/bash
# Script for pre-commit hook that runs Biome check
# - In CI (GitHub Actions): only verify (no --write)
# - In local: apply fixes automatically (--write)

if [ "$CI" = "true" ]; then
  # CI environment: only verify, don't apply changes
  npx @biomejs/biome check --diagnostic-level=error "$@"
else
  # Local environment: apply fixes automatically
  npx @biomejs/biome check --write --diagnostic-level=error "$@"
fi
