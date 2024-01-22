#!/bin/bash

repo="haivuw/react-router-infer"

current_version=$(gh release list --repo "$repo" --limit 1 | cut -f1) 

version=$(jq -r '.version' package.json)

read -p "Confirm updating from v$current_version to v$version? (y/n):" answer

if [ "$answer" == "y" ]; then
  echo "Updating..."
  gh release create v"$version" --repo="$repo" --title=v"$version" --generate-notes
  echo "Done."
else
  echo "Update canceled."
fi
