# !/bin/sh

if [ -e .git/hooks/pre-commit.sample ]; then
  rm .git/hooks/pre-commit.sample
elif [ -e .git/hooks/pre-commit ]; then
  rm .git/hooks/pre-commit
else
  echo 'You have not a pre-commit default file. Take it on'
fi

ln -s ../../git-hooks/pre-commit.sh .git/hooks/pre-commit

exit 0
