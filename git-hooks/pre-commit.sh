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
  echo -e "\033[0;41mCOMMIT FAILED:\033[0m \033[1;33mYour commit contains lint errors or warnings. Fix them before commit\033[0m"
  exit 1
fi

exit 0
