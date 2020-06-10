#!/bin/bash
BIN_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$BIN_DIR/.." || exit 1

cd packages || exit 1

# clean package, clean install, build
for package in botonic-*; do
  cd "$package" || exit
  echo "Preparing $package..."
  echo "===================================="
  echo "Cleaning..."
  nice rm -rf node_modules lib dist
  echo "Installing deps..."
  nice npm i -D > /dev/null
  echo "Building..."
  nice npm run build > /dev/null
  echo ""
  cd ..
done

# restart eslint_d in case any eslint plugin has been upgraded
killall eslint_d 2> /dev/null
killall -9 eslint_d 2> /dev/null
