#!/bin/bash
BIN_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
#cd "$BIN_DIR" || exit 1
ROOT_DIR="$BIN_DIR/../../"

PACKAGE_PATH=$(cd $1 && pwd)

echo "Lines at '$(basename $PACKAGE_PATH)'"
"$ROOT_DIR"/node_modules/.bin/cloc --match-f='js|js|ts|tsx' --not-match-f='\.test\.*' --not-match-d=node_modules $PACKAGE_PATH/src --json| grep SUM -A3| grep code

