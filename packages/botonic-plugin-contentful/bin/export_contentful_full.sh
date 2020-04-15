#!/bin/zsh
BIN_DIR=${0:a:h}

"$BIN_DIR"/../node_modules/.bin/contentful space export --download-assets \
  --space-id=$CONTENTFUL_TEST_SPACE_ID \
  --management-token=$CONTENTFUL_TEST_MANAGE_TOKEN
