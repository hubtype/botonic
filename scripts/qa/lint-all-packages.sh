#!/bin/bash
BIN_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$BIN_DIR" || exit 1

for package in ../../packages/botonic-*; do
  ./lint-package.sh $package
  if [[ $? != 0 ]]; then
    FAILED=$?
  fi
done
exit $FAILED
