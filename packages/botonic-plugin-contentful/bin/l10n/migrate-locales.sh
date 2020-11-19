#!/bin/zsh
set -ex
# Useful to clone the contents flow from a space when the target locales are different.
# It clones the specifying exported json file with the requested changes
# See LocaleMigrator class

BIN_DIR=${0:a:h}

if [[ $# -lt 4 ]]; then
  cd "$BIN_DIR"/../.. || exit
	../../node_modules/.bin/ts-node --files	src/tools/l10n/locale-migrate.ts --help
	exit 1
fi

FROM_FILE=$1
if [[ -n "$FROM_FILE" ]]; then
  FROM_FILE="$( cd "$( dirname "$FROM_FILE" )" && pwd )/$(basename $FROM_FILE)"
fi

TO_FILE=$2
if [[ -n "$TO_FILE" ]]; then
  TO_FILE="$( cd "$( dirname "$TO_FILE" )" && pwd )/$(basename $TO_FILE)"
fi

FROM_LOCALE=$3
TO_LOCALE=$4
REMOVE_LOCALES=$5


cd "$BIN_DIR"/../.. || exit



../../node_modules/.bin/ts-node --files	src/tools/l10n/locale-migrate.ts \
	"$FROM_FILE" "$TO_FILE" "$FROM_LOCALE" "$TO_LOCALE" "$REMOVE_LOCALES"
echo "Change Element.image so that it does not have 1 version per locale"
