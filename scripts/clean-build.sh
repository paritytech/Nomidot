  
#!/bin/bash
# Copyright 2017-2019 @substrate/nomidot authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

set -e

function clean_build () {
  ROOT=$1

  echo ""
  echo "*** Cleaning build directory $ROOT/lib"

  rimraf $ROOT/lib
}

function clean_cache () {
  ROOT=$1

  echo "*** Clearing Gatsby cache $ROOT/.cache"

  rimraf $ROOT/.cache
}

clean_cache "./front/gatsby"
clean_build "."

if [ -d "front" ]; then
  PACKAGES=( $(ls -1d front/*) )

  for PACKAGE in "${PACKAGES[@]}"; do
    clean_build "$PACKAGE"
  done
fi

exit 0