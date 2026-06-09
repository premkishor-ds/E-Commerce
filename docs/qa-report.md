# QA Automation Report

This report documents the testing strategy used to achieve target code coverage.

---

## 1. Test Suite Structure
- **Unit Tests**: Focuses on validation logic and services.
- **Integration Tests**: Tests database operations and repository structures.
- **E2E Tests**: Simulates full checkout and sign-up flows using Playwright.

---

## 2. Test Execution
- Run tests via standard scripts:
  - Unit: `npm test`
  - Integration/E2E: `npm run test:e2e`
- **Target Coverage**: 95%+ coverage on core authentication, checkout, and inventory services.
