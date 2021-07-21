#!/bin/zsh
BIN_DIR=${0:a:h}

"$BIN_DIR"/../node_modules/.bin/contentful space export --download-assets \
  --space-id=p37ctmlp8ln8 \
  --management-token=CFPAT-hExxoi5WwXaLtCR0oy6vuxDt3iLxpzSpCBqpCC-xbxc
