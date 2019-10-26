#!/bin/zsh
BIN_DIR=${0:a:h}

contentful space export --skip-content  --skip-roles \
  --space-id=$CONTENTFUL_TEST_SPACE_ID \
  --management-token=$CONTENTFUL_TEST_MANAGE_TOKEN
