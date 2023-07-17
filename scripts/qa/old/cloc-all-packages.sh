#!/bin/bash
BIN_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$BIN_DIR" || exit 1
PACKAGES_DIR="$BIN_DIR/../../packages"

for package in $PACKAGES_DIR/botonic-*; do
  ./cloc-package.sh $package
done
