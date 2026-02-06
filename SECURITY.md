# Security Policy

## Security Audit Status

✅ **Last Security Audit:** February 6, 2026  
✅ **Status:** No sensitive data, API keys, or credentials found in repository

## Reporting Security Vulnerabilities

If you discover a security vulnerability in this project, please report it by:

1. **DO NOT** create a public GitHub issue
2. Email the maintainer directly or use GitHub's private security advisory feature
3. Provide detailed information about the vulnerability

## Best Practices for Contributors

To keep this repository secure, please follow these guidelines:

### Never Commit Sensitive Data

❌ **NEVER commit:**
- API keys or tokens
- Passwords or credentials
- Private keys (`.pem`, `.key` files)
- Environment files (`.env`, `.env.local`)
- Personal email addresses or phone numbers
- Social security numbers or other PII
- Database connection strings with credentials
- OAuth client secrets
- AWS access keys or secrets

### Use .gitignore

This repository includes a `.gitignore` file that prevents common sensitive files from being committed. Make sure to:
- Keep the `.gitignore` file up to date
- Never force-add ignored files with `git add -f`
- Review your commits before pushing

### Before Committing

Always run these checks before committing:

```bash
# Check what files you're about to commit
git status

# Review the actual changes
git diff

# Make sure no sensitive data is included
grep -r "api.key\|password\|secret" .
```

### If You Accidentally Commit Sensitive Data

If you accidentally commit sensitive information:

1. **DO NOT** just delete it in a new commit (it's still in history)
2. **Immediately rotate/revoke** the exposed credentials
3. Contact the repository maintainer
4. Use tools like `git filter-branch` or `BFG Repo-Cleaner` to remove it from history (requires force push)

## Security Features

This repository:
- ✅ Contains only static HTML/CSS/JavaScript (no server-side code)
- ✅ Has no database or backend dependencies
- ✅ Uses external CDNs for fonts and icons (Google Fonts, Boxicons)
- ✅ Contains only public educational resource links
- ✅ Has a `.gitignore` file to prevent sensitive file commits

## Secure Development Guidelines

### For Maintainers

- Always review PRs for potential security issues
- Never merge PRs that contain credentials or secrets
- Keep dependencies up to date (if any are added in the future)
- Use GitHub's security scanning features

### For All Contributors

- Use HTTPS for all external links
- Verify that links point to legitimate educational resources
- Don't add tracking pixels or analytics without disclosure
- Keep personal information to a minimum

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |

## Updates

This security policy will be updated as the project evolves. Last update: February 6, 2026
