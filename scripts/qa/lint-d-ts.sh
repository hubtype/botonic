#!/bin/bash
if [ "$GITHUB_ACTIONS" == "true" ]; then
  echo 'Will skip tsc as it will run in separate workflow'
  exit
else
  echo "Will run tsc for package $1"
fi

BIN_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


cd "$BIN_DIR/../../$1" || exit
# useful to test index.d.ts files for JS projects
"$BIN_DIR"/../../node_modules/.bin/tsc --noEmit
