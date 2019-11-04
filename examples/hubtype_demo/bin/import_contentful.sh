#!/bin/zsh
BIN_DIR=${0:a:h}
cd $BIN_DIR

. ./credentials

contentful space import --space-id=$STAGING_SPACE \
    --management-token=$MNGMT_TOKEN \
    --content-file contentful-structure.json
