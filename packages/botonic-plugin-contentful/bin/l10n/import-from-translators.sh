#!/bin/zsh
BIN_DIR=${0:a:h}
cd "$BIN_DIR"/../.. || exit

if [[ $# -lt 8 ]]; then
	../../node_modules/.bin/ts-node --files	src/tools/l10n/import-csv-for-translators.ts --help
	exit 1
fi


SPACE_ID=$1
ENVIRONMENT=$2
DELIVER_TOKEN=$3
CONTENTFUL_MANAGEMENT_TOKEN=$4
LOCALE=$5
CSV_FILENAME=$6

WRITE_MODE=$7
#  DRY: parse files but do write to CM
#  NO_OVERWRITE: publishes the content, but fails if fields for this locale already have value
#  OVERWRITE: modifies previous value, but leaves it in UNPUBLISHED state

DUPLICATE_REFERENCES=$8

../../node_modules/.bin/ts-node --files	src/tools/l10n/import-csv-for-translators.ts \
	"$SPACE_ID" "$ENVIRONMENT" "$DELIVER_TOKEN" "$CONTENTFUL_MANAGEMENT_TOKEN" "$LOCALE" "$CSV_FILENAME" \
	"$WRITE_MODE" "$DUPLICATE_REFERENCES"
