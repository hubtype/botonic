#!/bin/bash
BIN_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$BIN_DIR/../.." || exit 1


cd packages || exit 1

VERSION=$2
PHASE=$3

update_botonic_deps (){
  # $template $1
  # $VERSION $2
  # $PHASE $3
  echo " - Updating botonic deps for '$1'"
  if [[ "$3" == "rc" ]]
  then
    sed -i.aux -E 's/("@botonic\/(.*)": )"(.*)"/\1"'${2}'"/' package.json
  else
    sed -i.aux -E 's/("@botonic\/(.*)": )"(.*)"/\1"~'${2}'"/' package.json
  fi
  rm package.json.aux
}

if [ -z "$PHASE" ]
    for package in botonic-*; do
      cd "$package" || exit
      echo "Bumping $package to $VERSION"
      echo "===================================="

      # Update botonic dependencies for every template
      if [[ "$package" == "botonic-cli" ]]
      then
        cd "templates" || exit
        for project in *; do
          cd "$project"
          update_botonic_deps "$project" "$VERSION" "$PHASE"
          cd ".."
        done
        cd ".."
      fi

      # Update botonic dependencies for packages pointing to other botonic projects
      if [ "$package" == "botonic-react" ] || [ "$package" == "botonic-plugin-nlu" ];
      then
        update_botonic_deps "$package" "$VERSION" "$PHASE"
      fi

      # Updates package.json and package-lock.json
      nice npm version $VERSION > /dev/null
      cd ..
    done
  then exit
fi

