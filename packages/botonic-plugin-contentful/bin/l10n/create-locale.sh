#!/bin/zsh
BIN_DIR=${0:a:h}
cd "$BIN_DIR"/../.. || exit

../../node_modules/.bin/ts-node --files src/tools/l10n/create-locale.ts
