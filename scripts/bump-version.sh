#!/bin/bash
BIN_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$BIN_DIR/.." || exit 1


cd packages || exit 1

VERSION=$1 

for package in botonic-*; do
  cd "$package" || exit
  echo "Bumping $package to $VERSION"
  echo "===================================="
  nice npm version $VERSION > /dev/null
  cd ..
done