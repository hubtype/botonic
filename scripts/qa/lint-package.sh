#!/bin/bash
cd $1
npm run lint
# when lint can fix all errors, npm will return 0
# In this case, we want to see which files were changed
if [[ $? == 0 ]]; then
  git status
  echo "If lint fixed some files, run the following to verify the changes and commit again:"
  echo " git diff"
  echo " git commit -a"
fi
