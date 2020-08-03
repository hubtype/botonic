#!/bin/zsh
BIN_DIR=${0:a:h}
cd "$BIN_DIR"/../.. || exit

if [[ $# -lt 5 ]]; then
	../../node_modules/.bin/ts-node --files	src/tools/l10n/import-csv-for-translators.ts --help
	exit 1
fi


SPACE_ID=$1
ENVIRONMENT=$2
CONTENTFUL_MANAGEMENT_TOKEN=$3
LOCALE=$4
CSV_FILENAME=$5
MODE=$6


../../node_modules/.bin/ts-node --files	src/tools/l10n/import-csv-for-translators.ts \
	"$SPACE_ID" "$ENVIRONMENT" "$CONTENTFUL_MANAGEMENT_TOKEN" "$LOCALE" "$CSV_FILENAME" "$MODE"
