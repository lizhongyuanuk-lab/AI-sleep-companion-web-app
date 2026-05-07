#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: npm run review:pr -- <pr-number|branch-name> [base-branch]

Examples:
  npm run review:pr -- 123
  npm run review:pr -- feature/my-branch
  npm run review:pr -- 123 develop
EOF
}

if [[ $# -lt 1 || $# -gt 2 ]]; then
  usage
  exit 1
fi

TARGET="$1"
BASE_BRANCH="${2:-main}"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree is not clean. Please commit or stash changes before running PR review."
  exit 1
fi

echo "Fetching base branch origin/${BASE_BRANCH}..."
git fetch origin "${BASE_BRANCH}"

if [[ "${TARGET}" =~ ^[0-9]+$ ]]; then
  if ! command -v gh >/dev/null 2>&1; then
    echo "GitHub CLI (gh) is required to review a PR by number."
    exit 1
  fi

  echo "Checking out PR #${TARGET}..."
  gh pr checkout "${TARGET}"
else
  echo "Fetching branch origin/${TARGET}..."
  git fetch origin "${TARGET}"

  if git show-ref --verify --quiet "refs/heads/${TARGET}"; then
    git checkout "${TARGET}"

    if [[ "$(git rev-parse HEAD)" != "$(git rev-parse "origin/${TARGET}")" ]]; then
      echo "Local branch '${TARGET}' does not match origin/${TARGET}."
      echo "Please align or delete the local branch, then rerun the review."
      exit 1
    fi
  else
    git checkout -b "${TARGET}" --track "origin/${TARGET}"
  fi
fi

echo
echo "Current branch:"
git branch --show-current

echo
echo "Latest commit:"
git log -1 --oneline

echo
echo "Changed files vs origin/${BASE_BRANCH}:"
git diff --name-only "origin/${BASE_BRANCH}...HEAD"

echo
echo "Diff stat vs origin/${BASE_BRANCH}:"
git diff --stat "origin/${BASE_BRANCH}...HEAD"

echo
if [[ -f package-lock.json ]]; then
  echo "Installing dependencies with npm ci..."
  npm ci
else
  echo "Installing dependencies with npm install..."
  npm install
fi

echo
echo "Running npm run lint..."
npm run lint

echo
echo "Running npm run build..."
npm run build

echo
echo "Technical checks passed."
echo "Next step: run 'npm run dev' for manual visual QA."
echo "Merge status: not merged. Manual merge only."
