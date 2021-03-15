#!/bin/bash
BIN_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$BIN_DIR/../.." || exit 1
date
set -x
cd "$1" || exit
shift

SCRIPT=${1:-lint}
npm run "$SCRIPT"

#EXIT_CODE=$?
# when lint can fix all errors, npm will return 0
# In this case, we want to see which files were changed
#if [[ $EXIT_CODE == 0 ]]; then
#  git status
#  echo "If lint fixed some files, run the following to verify the changes and commit again:"
#  echo " git diff"
#  echo " git commit -a"
#else
#  exit $EXIT_CODE
#fi
