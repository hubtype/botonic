#!/bin/zsh
BIN_DIR=${0:a:h}

if [[ "$CONTENTFUL_SPACEID" == "" ]]; then
  echo "Assign your contentful account spaceid to environment variable CONTENTFUL_SPACEID"
  exit 1
fi

if [[ "$CONTENTFUL_TOKEN" == "" ]]; then
  echo "Assign your Contentful Content management token to environment variable CONTENTFUL_TOKEN"
  exit 1
fi

contentful space import --space-id=$CONTENTFUL_SPACEID \
    --management-token=$CONTENTFUL_TOKEN \
    --content-file "$BIN_DIR/../exports/contentful-export-0.9.20.json"
