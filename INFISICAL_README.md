# Infisical + Playwright TypeScript — Local Setup Commands

This README documents the useful commands discussed while integrating **Infisical** with the Playwright TypeScript framework.

#### Local script development

Infisical
   ↓
infisical export --env=qa
   ↓
.env.qa
   ↓
dotenv
   ↓
process.env

#### Eventually, in GitHub Actions:

GitHub Actions
      │
      │ OIDC
      ▼
  Infisical
      │
      ▼
Environment Variables
      │
      ▼
process.env
      │
      ▼
CredentialsManager
      │
      ▼
Playwright

## 1. Prerequisites

Project:

```text
D:\Handson\PlaywrightWithTypescript_WishInfiniteYoutube
```

Infisical project:

```text
Playwright-Automation
```

Environment:

```text
QA
```

Target flow:

```text
Infisical
   ↓
infisical export
   ↓
.env.qa
   ↓
dotenv
   ↓
process.env
   ↓
CredentialsManager
   ↓
Playwright Tests
```

---

# 2. Verify Infisical CLI

Check whether Infisical is available:

```powershell
infisical --version
```

Expected output will be similar to:

```text
infisical version 0.43.120
```

Check where Windows resolves the executable:

```powershell
where.exe infisical
```

Check PowerShell command resolution:

```powershell
Get-Command infisical -ErrorAction SilentlyContinue
```

---

# 3. Check Infisical Winget Installation

Check the installed package:

```powershell
winget list infisical
```

Show package information:

```powershell
winget show infisical
```

The package can be identified as:

```text
infisical.infisical
```

If Winget reports that it is already installed:

```powershell
winget install infisical
```

you may not need to reinstall it.

---

# 4. Locate `infisical.exe` on Windows

If PowerShell says:

```text
infisical : The term 'infisical' is not recognized...
```

find the executable under the Winget package directory:

```powershell
Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet" -Recurse -Filter "infisical.exe" -ErrorAction SilentlyContinue
```

Other locations that can be searched:

```powershell
Get-ChildItem "$env:LOCALAPPDATA\Packages" -Recurse -Filter "infisical.exe" -ErrorAction SilentlyContinue
```

or:

```powershell
Get-ChildItem "$env:LOCALAPPDATA" -Recurse -Filter "infisical.exe" -ErrorAction SilentlyContinue
```

---

# 5. Test the Infisical Executable Directly

If the executable is found but is not in `PATH`, run it using its full path.

Example:

```powershell
& "C:\Users\<USERNAME>\AppData\Local\Microsoft\WinGet\Packages\infisical.infisical_Microsoft.Winget.Source_8wekyb3d8bbwe\infisical.exe" --version
```

Replace `<USERNAME>` with the Windows username.

---

# 6. Temporarily Add Infisical to PATH

Set the executable directory:

```powershell
$infisicalPath = "C:\Users\<USERNAME>\AppData\Local\Microsoft\WinGet\Packages\infisical.infisical_Microsoft.Winget.Source_8wekyb3d8bbwe"
```

Add it to the current PowerShell session:

```powershell
$env:Path = "$infisicalPath;$env:Path"
```

Verify:

```powershell
infisical --version
```

> The temporary `$env:Path` modification applies only to the current PowerShell session.

---

# 7. Permanently Add Infisical to User PATH

Get the current user PATH:

```powershell
[Environment]::GetEnvironmentVariable("Path", "User")
```

Add the Infisical directory:

```powershell
$infisicalPath = "C:\Users\<USERNAME>\AppData\Local\Microsoft\WinGet\Packages\infisical.infisical_Microsoft.Winget.Source_8wekyb3d8bbwe"

$userPath = [Environment]::GetEnvironmentVariable("Path", "User")

if ($userPath -notlike "*$infisicalPath*") {
    [Environment]::SetEnvironmentVariable(
        "Path",
        "$userPath;$infisicalPath",
        "User"
    )
}
```

Close all PowerShell/Windows Terminal windows and open a new one.

Then verify:

```powershell
where.exe infisical
```

and:

```powershell
infisical --version
```

---

# 8. Login to Infisical

For local development:

```powershell
infisical login
```

Verify the authenticated account:

```powershell
infisical whoami
```

At this stage, use your personal Infisical account.

Do not create a CI/CD Machine Identity yet. That will be used later for GitHub Actions.

---

# 9. Initialize the Local Project

From the Playwright project root:

```powershell
cd D:\Handson\PlaywrightWithTypescript_WishInfiniteYoutube
```

Initialize Infisical:

```powershell
infisical init
```

Select:

```text
Project: Playwright-Automation
Environment: QA
```

This creates:

```text
.infisical.json
```

The file links the local project with Infisical. It should not contain the actual secret values.

---

# 10. Verify QA Secrets

After `infisical init`, verify that Infisical can access the QA environment:

```powershell
infisical export --env=qa
```

This displays the secrets.

Example:

```text
BASE_URL=****
VALID_USERNAME=****
VALID_PASSWORD=****
```

Do not paste actual passwords or secret values into chat, source control, or logs.

---

# 11. Export QA Secrets to `.env.qa`

Generate the local environment file:

```powershell
infisical export --env=qa --output-file=.env.qa
```

Expected project structure:

```text
PlaywrightWithTypescript_WishInfiniteYoutube/
│
├── .env.qa
├── .infisical.json
│
├── data/
│   └── excel/
│       └── login-data.xlsx
│
├── fixtures/
├── pages/
├── tests/
├── utils/
│
├── playwright.config.ts
└── package.json
```

The `.env.qa` file is generated from Infisical and should not be treated as the source of truth.

Infisical is the source of truth.

---

# 12. Protect `.env.qa` with `.gitignore`

Recommended:

```gitignore
.env.*
```

Or explicitly:

```gitignore
.env.qa
.env.dev
.env.staging
```

Verify Git status:

```powershell
git status
```

Make sure `.env.qa` is not going to be committed.

---

# 13. Install `dotenv`

If `dotenv` is not already installed:

```powershell
npm install dotenv
```

---

# 14. Load `.env.qa` in Playwright

In `playwright.config.ts`:

```typescript
import dotenv from 'dotenv';

dotenv.config({
    path: `.env.${process.env.ENV_NAME || 'qa'}`
});
```

This means:

```text
ENV_NAME=qa
    ↓
.env.qa
```

If `ENV_NAME` is not specified, `qa` is used as the default.

---

# 15. Set Environment Name in PowerShell

For QA:

```powershell
$env:ENV_NAME="qa"
```

Then:

```powershell
npx playwright test
```

Or simply rely on the default:

```powershell
npx playwright test
```

because the configuration defaults to:

```text
qa
```

---

# 16. Verify Environment Variables Safely

Do not print passwords.

Safe verification:

```typescript
console.log('BASE_URL:', process.env.BASE_URL);

console.log(
    'VALID_USERNAME exists:',
    Boolean(process.env.VALID_USERNAME)
);

console.log(
    'VALID_PASSWORD exists:',
    Boolean(process.env.VALID_PASSWORD)
);
```

Expected:

```text
BASE_URL: https://...
VALID_USERNAME exists: true
VALID_PASSWORD exists: true
```

Never do:

```typescript
console.log(process.env.VALID_PASSWORD);
```

---

# 17. Excel → CredentialsManager → Playwright

Recommended Excel structure:

| TestCaseId | Scenario | UsernameKey | PasswordKey | ExpectedResult |
|---|---|---|---|---|
| TC001 | Valid Login | VALID_USERNAME | VALID_PASSWORD | success |

Excel contains **keys**, not actual passwords.

Example:

```text
UsernameKey = VALID_USERNAME
PasswordKey = VALID_PASSWORD
```

Infisical contains the actual values:

```text
VALID_USERNAME = actual username
VALID_PASSWORD = actual password
```

The CredentialsManager resolves them:

```typescript
const username = process.env[usernameKey];
const password = process.env[passwordKey];
```

Architecture:

```text
Excel
  ↓
UsernameKey / PasswordKey
  ↓
CredentialsManager
  ↓
process.env
  ↓
.env.qa
  ↓
Infisical
```

---

# 18. Recommended CredentialsManager

Example:

```typescript
import { Credentials } from '../types/Credentials';

export class CredentialsManager {

    static getCredentials(
        usernameKey: string,
        passwordKey: string
    ): Credentials {

        const username = process.env[usernameKey];
        const password = process.env[passwordKey];

        if (!username) {
            throw new Error(
                `Username credential not found for key: ${usernameKey}`
            );
        }

        if (!password) {
            throw new Error(
                `Password credential not found for key: ${passwordKey}`
            );
        }

        return {
            username,
            password
        };
    }
}
```

---

# 19. Recommended Local Workflow

Every time you need fresh QA credentials:

```powershell
infisical login
```

Then:

```powershell
infisical export --env=qa --output-file=.env.qa
```

Then:

```powershell
npx playwright test
```

The complete process is:

```text
              Infisical
                  │
                  │ QA secrets
                  ▼
       infisical export
                  │
                  ▼
              .env.qa
                  │
                  │ dotenv
                  ▼
            process.env
                  │
                  ▼
        CredentialsManager
                  │
                  ▼
             LoginPage
                  │
                  ▼
          Playwright Test
```

---

# 20. Important Security Rules

### Never commit:

```text
.env.qa
```

### Never commit:

```text
VALID_PASSWORD=actualPassword
```

### Never print:

```typescript
console.log(process.env.VALID_PASSWORD);
```

### Don't put actual credentials in Excel.

Excel should contain:

```text
VALID_USERNAME
VALID_PASSWORD
```

not:

```text
Admin
admin123
```

### Don't store Infisical authentication credentials in Git.

For local development, use:

```powershell
infisical login
```

For CI/CD, use a dedicated machine identity/OIDC approach.

---

# 21. Future GitHub Actions Architecture

The local workflow is:

```text
Infisical
   ↓
infisical export
   ↓
.env.qa
   ↓
Playwright
```

For GitHub Actions, the preferred architecture is:

```text
GitHub Actions
       │
       │ OIDC
       ▼
   Infisical
       │
       │ QA secrets
       ▼
Runtime environment variables
       │
       ▼
Playwright
```

This avoids generating a plaintext `.env.qa` file in CI.

For GitHub Actions, prefer **OIDC + Infisical Machine Identity** instead of storing a long-lived Infisical secret in GitHub.

---

# 22. Useful Troubleshooting Commands

Check Infisical version:

```powershell
infisical --version
```

Check executable resolution:

```powershell
where.exe infisical
```

Check PowerShell command:

```powershell
Get-Command infisical -ErrorAction SilentlyContinue
```

Check whether a specific executable exists:

```powershell
Test-Path "C:\path\to\infisical.exe"
```

Inspect current PATH:

```powershell
$env:Path -split ';'
```

Inspect User PATH:

```powershell
[Environment]::GetEnvironmentVariable("Path", "User") -split ';'
```

Inspect Winget package:

```powershell
winget show infisical
```

Check installed package:

```powershell
winget list infisical
```

---

# 23. Current Status

The following local setup has been completed:

```text
✅ Infisical CLI installed
✅ Infisical CLI available from PowerShell
✅ Version verified
```

Current CLI version:

```text
0.43.120
```

Next local steps:

```text
⬜ infisical login
⬜ infisical whoami
⬜ infisical init
⬜ Select Playwright-Automation
⬜ Select QA
⬜ infisical export --env=qa
⬜ Generate .env.qa
⬜ Load .env.qa with dotenv
⬜ Verify process.env
⬜ Connect CredentialsManager
⬜ Run Playwright login test
```

After the local workflow is stable, move to:

```text
GitHub Actions
      ↓
Infisical OIDC
      ↓
QA secrets
      ↓
Playwright
```

---

## Official Resources

- Infisical documentation: https://infisical.com/docs
- Infisical CLI documentation: https://infisical.com/docs/cli/overview
- Infisical CLI `export`: https://infisical.com/docs/cli/commands/export
- Infisical CLI `run`: https://infisical.com/docs/cli/commands/run
- Infisical GitHub Actions integration: https://infisical.com/docs/integrations/secret-backends/github-actions
