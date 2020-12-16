#!/bin/bash
BIN_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$BIN_DIR/../.." || exit 1

# upgrade dependencies of all packages
cd packages || exit 1
for package in botonic-*; do
  cd "$package" || exit
  echo "Upgrading $package dependencies"
  echo "===================================="
  nice npm i -D > /dev/null
  cd ..
done

# restart eslint_d in case any eslint plugin has been upgraded
eslint_d restart
