#!/bin/bash
BIN_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

for package in packages/botonic-*; do
  $BIN_DIR/lint-package.sh $package
  if [[ $? != 0 ]]; then
    FAILED=$?
  fi
done
exit $FAILED
