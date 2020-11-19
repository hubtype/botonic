#!/bin/zsh
BIN_DIR=${0:a:h}
cd "$BIN_DIR"/.. || exit

if [[ "$CONTENTFUL_SPACEID" == "" ]]; then
  echo "Assign your contentful account space id to environment variable CONTENTFUL_SPACEID"
  exit 1
fi

if [[ "$CONTENTFUL_TOKEN" == "" ]]; then
  echo "Assign your Contentful Content management token to environment variable CONTENTFUL_TOKEN"
  exit 1
fi

JSON_FILE=$1

if [[ "$JSON_FILE" == "" ]]; then
  echo "Usage: $0 file_to_import "
  exit 1
fi

./node_modules/.bin/contentful space import --space-id=$CONTENTFUL_SPACEID \
    --management-token=$CONTENTFUL_TOKEN \
    --content-file "$JSON_FILE"
