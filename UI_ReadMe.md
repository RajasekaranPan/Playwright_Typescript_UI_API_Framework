# UI Automation Framework — Quick Start Guide

A **production-grade Playwright + TypeScript** UI automation framework for comprehensive web application testing.

---

## 📌 Framework Overview

This framework provides:

- **Page Object Model (POM)** pattern for maintainable test code
- **Type-safe Playwright fixtures** for test setup and dependency injection
- **Multi-source test data** support (Excel, Faker, Infisical environment config)
- **Secure credential management** with AES encryption
- **Reusable UI action wrappers** (click, fill, navigate, wait, etc.)
- **Storage-state authentication** to avoid repeated login
- **HTML reporting** with screenshots, videos, and traces
- **Database validation** capability for end-to-end testing

---

## 🛠 Technology Stack

| Component              | Technology      | Version           |
| ---------------------- | --------------- | ----------------- |
| **Test Framework**     | Playwright      | ^1.62.1           |
| **Language**           | TypeScript      | ^7.0.2            |
| **Runtime**            | Node.js         | 20.x LTS          |
| **Test Data**          | Faker.js / XLSX | ^10.5.0 / ^0.18.5 |
| **Encryption**         | crypto-js       | ^4.2.0            |
| **Environment Config** | dotenv          | ^17.4.2           |
| **Database**           | IBM DB2         | ^4.0.1            |
| **CLI Utilities**      | cross-env       | ^10.1.0           |

---

## 🏗 High-Level Architecture

```
Test Cases (spec.ts)
        ↓
   Fixtures (Setup/Teardown)
        ↓
Page Objects & Sections
        ↓
Core Framework (BasePage + PlaywrightActions)
        ↓
Playwright API
        ↓
Browser (Chromium/Firefox/Safari)
```

**Layer Breakdown:**

- **Test Cases** — Business logic and assertions
- **Fixtures** — Pre-configured Page Objects, utilities, hooks
- **Page Objects** — UI element locators and interactions
- **Core Framework** — Reusable action wrapper, base classes
- **Playwright API** — Native browser automation
- **Browser** — Actual browser execution

---

## 📁 Project Structure

```
project/
├── core/                   # Base framework, Playwright action wrappers
│   ├── BasePage.ts         # Abstract base for all page objects
│   └── playwright/         # Action wrappers (click, fill, wait, etc.)
├── fixtures/               # Playwright test fixtures
│   ├── pom-fixtures.ts     # Page Object injection
│   ├── common-fixtures.ts  # Utilities (encryption, etc.)
│   ├── credentials-fixtures.ts  # Pre-decrypted credentials
│   └── hooks-fixtures.ts   # BeforeEach/AfterEach logic
├── pages/                  # Page Object classes
│   ├── LoginPage.ts
│   └── PersonalDetailsPage.ts
├── sections/               # Reusable UI components
│   └── UserProfileMenu.ts, LeftNavigationItems.ts
├── tests/                  # Test specifications
│   ├── global.setup.ts     # Authentication setup (runs once)
│   ├── ui-tests/           # UI test suites
│   └── apiTests/           # API tests (separate project)
├── utils/                  # Helper utilities
│   ├── CommonUtils.ts      # Encryption/decryption
│   ├── CredentialsManager.ts
│   ├── EnvironmentManager.ts
│   ├── ExcelReader.ts      # Excel parsing
│   └── TestDataLoader.ts
├── types/                  # TypeScript interfaces and types
├── data/                   # Test data (Excel, JSON)
├── env-files/              # Environment configuration
│   └── .env.qa             # QA environment variables
├── config/                 # Configuration paths
├── playwright.config.ts    # Playwright configuration
└── package.json            # Dependencies and npm scripts
```

---

## ✨ Key Capabilities

- **Page Object Model** — Organize UI interactions by page/section
- **Reusable Sections** — Shared UI components across multiple tests
- **Custom Fixtures** — Type-safe dependency injection
- **PlaywrightActions Wrapper** — Simplified action syntax (click, fill, wait)
- **Storage State Auth** — Cached login to speed up test execution
- **Excel Test Data** — Parameterized tests from spreadsheets
- **Faker Integration** — Dynamically generated test data
- **Encryption/Decryption** — Secure credential handling
- **Database Validation** — Query backend DB2 for end-to-end verification
- **Environment Configuration** — Multi-environment support (QA, UAT, etc.)
- **Infisical Integration** — Centralized secrets and configuration management
- **HTML Reports** — Screenshots, videos, and traces on failure
- **Visual Testing** — Screenshot-based regression testing

---

## 🔐 Environment & Infisical

The framework uses **Infisical** for secure environment and configuration management:

```
Infisical (Centralized Secrets)
        ↓
infisical export --env=qa
        ↓
.env.qa (Local environment file)
        ↓
dotenv (Loads into process.env)
        ↓
Tests (Access via EnvironmentManager, CredentialsManager)
```

**What Infisical manages:**

- Application credentials (username, password)
- Database configuration
- Base URLs for different environments
- Test-specific secrets

See [INFISICAL_README.md](INFISICAL_README.md) for detailed setup.

---

## 🔄 Test Execution Flow

```
1. Environment Configuration
   ↓
2. Load .env.qa (via dotenv)
   ↓
3. Run global.setup.ts (Login → Save Storage State)
   ↓
4. Initialize Browser (Load Saved Auth State)
   ↓
5. Create Fixtures (POM, Utils, Hooks)
   ↓
6. Execute Test Steps
   ├─ Before Hook (if any)
   ├─ Test logic with assertions
   └─ After Hook (if any)
   ↓
7. Generate Report (HTML with screenshots/videos)
```

---

## 🚀 Running UI Tests

### Install Dependencies

```bash
npm install
npx playwright install chromium
```

### Run Tests

```bash
# Run all UI tests (headless)
npm run test:qa

# Run with browser visible (headed)
npm run test:qa:hd:report:html

# Run specific test file
npx playwright test tests/ui-tests/loginPageTest-NoAuthNeeded.spec.ts

# Run tests with specific tag
npx playwright test --grep "@Smoke"

# Debug mode (step through with Inspector)
npm run test:debug

# View HTML report
npm run test:report:open
```

---

## ➕ Adding a New UI Test

1. **Identify the page/section** — Does it exist? Create Page Object if needed
2. **Create locators** — Add element selectors inside Page Object
3. **Add page methods** — Implement user interactions (login, fill form, click button, etc.)
4. **Create test file** — In `tests/ui-tests/`
5. **Import fixtures** — Use `pom-fixtures` or `common-fixtures`
6. **Write test logic** — Use page objects, add assertions
7. **Run & verify** — Execute test, check HTML report
8. **Add tags** — Mark with `@Smoke`, `@Regression`, etc. for filtering

---

## ✅ Framework Guidelines

- ✓ Keep locators inside Page Objects, not in tests
- ✓ Extend `BasePage` for all page classes
- ✓ Use semantic Playwright selectors (`getByRole`, `getByLabel`, etc.)
- ✓ Reuse existing fixtures and utilities
- ✓ Keep tests focused on business scenarios (not implementation details)
- ✓ Never hardcode credentials or secrets
- ✓ Use `test.step()` for better reporting
- ✓ Follow existing naming conventions (PascalCase for classes, camelCase for methods)
- ✓ Prefer Playwright's built-in wait mechanisms
- ✓ Avoid duplicating framework functionality

---

## 📊 Test Reporting

The framework captures and reports:

- **HTML Report** — Interactive test results
- **Screenshots** — Captured on test failure
- **Videos** — Full test recording on failure
- **Traces** — Detailed execution trace for debugging
- **Test Results** — JSON/XML export available

View latest report:

```bash
npm run test:report:open
```

---

## 📖 Quick Reference

| Command                          | Purpose                        |
| -------------------------------- | ------------------------------ |
| `npm run test:qa`                | Run all UI tests (headless)    |
| `npm run test:qa:hd:report:html` | Run in headed mode with report |
| `npm run test:debug`             | Debug mode with Inspector      |
| `npm run test:report:open`       | View HTML report               |

| Folder            | Purpose                             |
| ----------------- | ----------------------------------- |
| `pages/`          | Page Object classes                 |
| `sections/`       | Reusable UI sections                |
| `fixtures/`       | Test setup and dependency injection |
| `tests/ui-tests/` | Test specifications                 |
| `utils/`          | Helper functions                    |
| `env-files/`      | Environment-specific config         |

---

**For detailed documentation**, see [README.md](README.md) and [INFISICAL_README.md](INFISICAL_README.md).
