SECURITY INCIDENT: Exposed Secrets

If you found API keys or other secrets committed to this repository, treat this as a security incident:

1. Rotate the exposed keys immediately (OpenAI, Anthropic, cloud providers, etc.).
2. Remove secrets from the repository history. Recommended tools:
   - `git filter-repo` (preferred): https://github.com/newren/git-filter-repo
   - BFG Repo Cleaner: https://rtyley.github.io/bfg-repo-cleaner/
3. Add the secret names and patterns to `.gitignore` and ensure no other files contain secrets.
4. Revoke any tokens that may have been leaked and monitor for misuse.

Example `git filter-repo` usage to remove a key:

```bash
# Replace 'YOUR_SECRET' with the secret value
git clone --mirror <repo-url> repo.git
cd repo.git
git filter-repo --invert-paths --paths-glob 'backend/.env' --force
git push --force
```

Notes:
- This repository already includes `backend/.env` in `.gitignore`, but a committed copy contained keys.
- After purging history, inform collaborators to re-clone the cleaned repository.
