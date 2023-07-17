#!/bin/bash

if [ "$GITHUB_ACTIONS" == "true" ]; then
  echo 'Will skip lint as it will run in separate workflow'
  exit
else
  echo "Will run linters for package $1"
fi

cd "$1" || exit

# quick lint. Not running slow lint to avoid penalizing pre-commit
npm run lint

EXIT_CODE=$?
# when lint can fix all errors, npm will return 0
# In this case, we want to see which files were changed
if [[ $EXIT_CODE == 0 ]]; then
  git status
  echo "If lint fixed some files, run the following to verify the changes and commit again:"
  echo " git diff"
  echo " git commit -a"
else
  exit $EXIT_CODE
fi
