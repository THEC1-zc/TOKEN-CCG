#!/usr/bin/env bash
# Version: V1.0.0
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

echo "[check-no-secrets] scanning tracked files for high-risk secret patterns..."

if [[ -z "$(git ls-files)" ]]; then
  echo "[check-no-secrets] no tracked files found."
  exit 0
fi

# High-signal patterns only, focused on real secret leaks in code/config files.
PATTERN='(ghp_[A-Za-z0-9]{36}|gho_[A-Za-z0-9]{36}|ghu_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN (RSA|EC|OPENSSH|DSA|PRIVATE KEY)-----|[A-Z_]*PRIVATE_KEY[A-Z_]*[[:space:]]*[:=][[:space:]]*["'"'"']?0x[a-fA-F0-9]{64}|SUPABASE_SERVICE_ROLE_KEY[[:space:]]*[:=][[:space:]]*["'"'"']?[A-Za-z0-9._-]+)'

FOUND=0
while IFS= read -r file; do
  case "${file}" in
    *.js|*.mjs|*.cjs|*.ts|*.tsx|*.json|*.yml|*.yaml|*.env|*.env.*|*.html|*.sol|*.sh|*.toml)
      ;;
    *)
      continue
      ;;
  esac

  if grep -n -E "${PATTERN}" "${file}"; then
    FOUND=1
  fi
done < <(git ls-files)

if [[ "${FOUND}" -eq 1 ]]; then
  echo "[check-no-secrets] FAILED: potential secret/private key detected."
  exit 1
fi

echo "[check-no-secrets] OK: no high-risk patterns found."
