#!/bin/zsh
BIN_DIR=${0:a:h}

if [[ "$1" == "" ]]; then
  echo "Usage: $0 file_to_import"
  echo "Imports the content models. "
  echo "Remove --content-model-only to also import the contents"
  exit 1
fi

JSON_FILE="$( cd "$( dirname "$1" )" && pwd )/$(basename $1)"

if [[ "$CONTENTFUL_SPACEID" == "" ]]; then
  echo "Assign your contentful account space id to environment variable CONTENTFUL_SPACEID"
  exit 1
fi

if [[ "$CONTENTFUL_TOKEN" == "" ]]; then
  echo "Assign your Contentful Content management token to environment variable CONTENTFUL_TOKEN"
  exit 1
fi

cd "$BIN_DIR"/.. || exit

./node_modules/.bin/contentful space import --space-id=$CONTENTFUL_SPACEID \
    --management-token=$CONTENTFUL_TOKEN \
    --content-model-only \
    --content-file "$JSON_FILE"
