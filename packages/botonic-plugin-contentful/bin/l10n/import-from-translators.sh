#!/bin/zsh
SPACE_ID=$1
ENVIRONMENT=$2
DELIVER_TOKEN=$3
CONTENTFUL_MANAGEMENT_TOKEN=$4
LOCALE=$5
CSV_FILENAME=$6
CSV_FILENAME="$( cd "$( dirname "$CSV_FILENAME" )" && pwd )/$(basename $CSV_FILENAME)"


BIN_DIR=${0:a:h}
cd "$BIN_DIR"/../.. || exit

if [[ $# -lt 8 ]]; then
	../../node_modules/.bin/ts-node --files	src/tools/l10n/import-csv-from-translators.ts --help
	exit 1
fi



WRITE_MODE=$7
#  DRY: parse files but do write to CM
#  NO_OVERWRITE: publishes the content, but fails if fields for this locale already have value
#  OVERWRITE: modifies previous value, but leaves it in UNPUBLISHED state
#  OVERWRITE_AND_PUBLISH: overwrites previous value and publishes it (only for new spaces!)

DUPLICATE_REFERENCES=$8

../../node_modules/.bin/ts-node --files	src/tools/l10n/import-csv-from-translators.ts \
	"$SPACE_ID" "$ENVIRONMENT" "$DELIVER_TOKEN" "$CONTENTFUL_MANAGEMENT_TOKEN" "$LOCALE" "$CSV_FILENAME" \
	"$WRITE_MODE" "$DUPLICATE_REFERENCES"
