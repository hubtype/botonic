#!/bin/zsh
set -e
BIN_DIR=${0:a:h}

if [[ $# != 1 ]]; then
  echo "Usage: $0 migration_file.ts"
  echo "Example: $0  bin/migrations/content-types/text.ts"
  echo
  echo "Script to add new content types or fields"
  echo "Be aware that some content-types migrations are WIP. Review before executing them"
  echo "To populate a new space, use bin/import-contentful-models.sh"
  exit 1
fi


SPACE_ID=$CONTENTFUL_TEST_SPACE_ID
MANAGE_TOKEN=$CONTENTFUL_TEST_MANAGE_TOKEN


SOURCE=$(dirname "$1")/$(basename "$1" .ts)
echo "compiling migration script"
tsc "$SOURCE.ts"
echo "Applying migration"
node_modules/.bin/contentful space migration --space-id="$SPACE_ID" \
    --access-token="$MANAGE_TOKEN" --management-token="$MANAGE_TOKEN" \
    "$SOURCE.js"
rm "$SOURCE.js"
