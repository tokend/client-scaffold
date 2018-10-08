#!/bin/bash

files=$(git diff --cached --name-only --diff-filter=ACM | grep -E "(.js|.vue)$")

if [ "$files" == "" ]; then
  exit 0
fi

lintfiles=""
errors="false"

for file in ${files}; do
  if [ $file != *".eslintrc.js"* ]; then
    ./node_modules/.bin/eslint --max-warnings 0 $file --no-ignore
    if [ $? -ne 0 ]; then
      lintfiles+="\n$file"
      errors="true"
    fi
  fi
done

if [ "$errors" == "true" ]; then
  echo "\n\033[41m COMMIT FAILED: \033[0m Your commit contains lint errors and/or warnings. Fix them before commit"
  exit 1
fi

exit 0
