#!/bin/zsh
BIN_DIR=${0:a:h}
cd "$BIN_DIR"/../.. || exit

# Execute with --help to get instructions
../../node_modules/.bin/ts-node --files src/tools/l10n/application/xls-to-csv.ts "$@"
