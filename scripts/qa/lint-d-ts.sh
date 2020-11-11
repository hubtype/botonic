#!/bin/bash
BIN_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


cd "$BIN_DIR/../../$1" || exit
# useful to test index.d.ts files for JS projects
"$BIN_DIR"/../../node_modules/.bin/tsc --noEmit
