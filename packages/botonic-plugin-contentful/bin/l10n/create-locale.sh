#!/bin/zsh
BIN_DIR=${0:a:h}
cd "$BIN_DIR"/../.. || exit

SPACE_ID=$1
ENVIRONMENT=$2
ACCESS_TOKEN=$3
LOCAL_NAME=$4
LOCALE_CODE=$5

# Execute with --help to get instructions
../../node_modules/.bin/ts-node --files src/tools/l10n/create-locale.ts \
	"$SPACE_ID" "$ENVIRONMENT" "$ACCESS_TOKEN" "$LOCAL_NAME" "$LOCALE_CODE"
