#!/bin/bash
set -e
BIN_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$BIN_DIR/../.." || exit 1
renice 10 $$ > /dev/null

# restart eslint_d in case any eslint plugin has been upgraded
eslint_d stop > /dev/null

echo "Upgrading common dev dependencies"
echo "===================================="
npm i -D

# upgrade dependencies of all packages
cd packages || exit 1
for package in botonic-*; do
  cd "$package" || exit
  echo "Upgrading $package dependencies"
  echo "===================================="
  BOTONIC_NO_INSTALL_ROOT_DEPENDENCIES=1 npm i -D > /dev/null
  cd ..
done

eslint_d start
