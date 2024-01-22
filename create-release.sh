#!/bin/bash

repo="haivuw/react-router-infer"

current_version=$(gh release list --repo "$repo" --limit 1 | cut -f1) || 0

version=$(jq -r '.version' package.json)

read -p "Confirm updating from $current_version to $version? (y/n):" answer

if [ "$answer" == "y" ]; then
  echo "Updating..."
  gh release create "$version" --repo="$repo" --title="$version" --generate-notes
  echo "Done."
else
  echo "Update canceled."
fi
