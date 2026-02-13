#!/bin/bash

# Claude Git Wrapper
# Uso: ./git-sync.sh "commit message"

cd "$(dirname "$0")/.."

MESSAGE="${1:-Claude: Auto-sync changes}"

echo "🔍 Checking for changes..."
if [[ -z $(git status --porcelain) ]]; then
  echo "✅ No changes to commit"
  exit 0
fi

echo "📝 Changed files:"
git status --short

echo ""
echo "📦 Staging changes..."
git add -A

echo "💾 Committing..."
git commit -m "$MESSAGE"

echo "🚀 Pushing to remote..."
BRANCH=$(git branch --show-current)
git push origin "$BRANCH"

echo "✅ Sync complete!"
