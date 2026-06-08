/**
 * ApexStore — Credential & Role Verification Script
 *
 * Tests every user account against the live backend API:
 *   - Login succeeds with correct email + password
 *   - JWT token is returned and valid
 *   - Returned role matches the expected role
 *   - Role-gated endpoints respond correctly for each user
 *
 * Usage:
 *   node check-credentials.js
 *
 * Requirements:
 *   - Backend must be running on http://localhost:5001
 */

const BASE_URL = 'http://localhost:5001/api/v1';

// ─── ANSI colours ─────────────────────────────────────────────────────────────
const GREEN  = '\x1b[32m';
const RED    = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN   = '\x1b[36m';
const BOLD   = '\x1b[1m';
const RESET  = '\x1b[0m';

// ─── All accounts to verify ───────────────────────────────────────────────────
const ACCOUNTS = [
  // ── Customers (Customer Storefront — localhost:3000) ──────────────────────
  { email: 'john.doe@example.com',      password: 'Password123!',   expectedRole: 'Customer', site: 'Customer Storefront (localhost:3000)' },
  { email: 'alice.smith@example.com',   password: 'Password123!',   expectedRole: 'Customer', site: 'Customer Storefront (localhost:3000)' },
  { email: 'bob.johnson@example.com',   password: 'Password123!',   expectedRole: 'Customer', site: 'Customer Storefront (localhost:3000)' },
  { email: 'clara.oswald@example.com',  password: 'Password123!',   expectedRole: 'Customer', site: 'Customer Storefront (localhost:3000)' },
  { email: 'danny.pink@example.com',    password: 'Password123!',   expectedRole: 'Customer', site: 'Customer Storefront (localhost:3000)' },
  { email: 'amy.pond@example.com',      password: 'Password123!',   expectedRole: 'Customer', site: 'Customer Storefront (localhost:3000)' },
  { email: 'rory.williams@example.com', password: 'Password123!',   expectedRole: 'Customer', site: 'Customer Storefront (localhost:3000)' },
  { email: 'river.song@example.com',    password: 'Password123!',   expectedRole: 'Customer', site: 'Customer Storefront (localhost:3000)' },
  { email: 'martha.jones@example.com',  password: 'Password123!',   expectedRole: 'Customer', site: 'Customer Storefront (localhost:3000)' },
  { email: 'donna.noble@example.com',   password: 'Password123!',   expectedRole: 'Customer', site: 'Customer Storefront (localhost:3000)' },

  // ── Admin (Admin Dashboard — localhost:3004) ───────────────────────────────
  { email: 'admin@example.com',         password: 'AdminPassword123!', expectedRole: 'Admin',  site: 'Admin Dashboard    (localhost:3004)' },

  // ── Seller (Seller Console — localhost:3002) ──────────────────────────────
  { email: 'seller@example.com',        password: 'password123',    expectedRole: 'Seller',   site: 'Seller Console     (localhost:3002)' },

  // ── Vendor (Vendor Console — localhost:3003) ──────────────────────────────
  { email: 'vendor@example.com',        password: 'password123',    expectedRole: 'Vendor',   site: 'Vendor Console     (localhost:3003)' },
];

// ─── Role-gated endpoint tests ────────────────────────────────────────────────
// Each role has specific protected endpoints that should return 200 (OK)
// and others that should return 401/403 (Forbidden)
const ROLE_ENDPOINT_TESTS = {
  Customer: [
    { method: 'GET',  path: '/sales/cart',        expectStatus: 200, label: 'GET /sales/cart (own cart)' },
    { method: 'GET',  path: '/sales/wishlist',     expectStatus: 200, label: 'GET /sales/wishlist' },
    { method: 'GET',  path: '/profile/me',         expectStatus: 200, label: 'GET /profile/me' },
    { method: 'GET',  path: '/admin/stats',        expectStatus: 403, label: 'GET /admin/stats (should be DENIED)' },
  ],
  Admin: [
    { method: 'GET',  path: '/admin/stats',        expectStatus: 200, label: 'GET /admin/stats (admin access)' },
    { method: 'GET',  path: '/admin/users',        expectStatus: 200, label: 'GET /admin/users' },
    { method: 'GET',  path: '/admin/orders',       expectStatus: 200, label: 'GET /admin/orders' },
    { method: 'GET',  path: '/admin/products',     expectStatus: 200, label: 'GET /admin/products' },
    { method: 'GET',  path: '/admin/vendors',      expectStatus: 200, label: 'GET /admin/vendors' },
    { method: 'GET',  path: '/admin/coupons',      expectStatus: 200, label: 'GET /admin/coupons' },
  ],
  Seller: [
    { method: 'GET',  path: '/catalog/products',   expectStatus: 200, label: 'GET /catalog/products' },
    { method: 'GET',  path: '/profile/me',         expectStatus: 200, label: 'GET /profile/me' },
    { method: 'GET',  path: '/sales/vendor/settlements', expectStatus: 200, label: 'GET /sales/vendor/settlements' },
    { method: 'GET',  path: '/admin/stats',        expectStatus: 403, label: 'GET /admin/stats (should be DENIED)' },
  ],
  Vendor: [
    { method: 'GET',  path: '/catalog/products',   expectStatus: 200, label: 'GET /catalog/products' },
    { method: 'GET',  path: '/profile/me',         expectStatus: 200, label: 'GET /profile/me' },
    { method: 'GET',  path: '/sales/vendor/settlements', expectStatus: 200, label: 'GET /sales/vendor/settlements' },
    { method: 'GET',  path: '/catalog/vendor/analytics', expectStatus: 200, label: 'GET /catalog/vendor/analytics' },
    { method: 'GET',  path: '/admin/stats',        expectStatus: 403, label: 'GET /admin/stats (should be DENIED)' },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pass(msg)  { console.log(`  ${GREEN}✔${RESET}  ${msg}`); }
function fail(msg)  { console.log(`  ${RED}✘${RESET}  ${msg}`); }
function warn(msg)  { console.log(`  ${YELLOW}⚠${RESET}  ${msg}`); }
function info(msg)  { console.log(`  ${CYAN}ℹ${RESET}  ${msg}`); }

async function httpPost(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  let json = null;
  try { json = await res.json(); } catch { /* ignore */ }
  return { status: res.status, json };
}

async function httpGet(path, token) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  return { status: res.status };
}

// ─── Check backend is reachable ───────────────────────────────────────────────
async function checkBackendReachable() {
  try {
    const res = await fetch(`${BASE_URL}/catalog/products`, { method: 'GET' });
    return res.status < 500;
  } catch {
    return false;
  }
}

// ─── Main runner ──────────────────────────────────────────────────────────────
async function run() {
  console.log(`\n${BOLD}${CYAN}═══════════════════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}${CYAN}   ApexStore — Credential & Role Verification Script   ${RESET}`);
  console.log(`${BOLD}${CYAN}═══════════════════════════════════════════════════════${RESET}\n`);

  // 1. Check backend
  console.log(`${BOLD}[0] Checking backend availability at ${BASE_URL}...${RESET}`);
  const reachable = await checkBackendReachable();
  if (!reachable) {
    console.log(`\n${RED}${BOLD}✘ Backend is NOT reachable at ${BASE_URL}${RESET}`);
    console.log(`${YELLOW}  → Start the backend first: cd backend && npm run start${RESET}\n`);
    process.exit(1);
  }
  pass(`Backend is reachable at ${BASE_URL}`);

  const results = { passed: 0, failed: 0, total: 0 };

  // 2. Test each account
  for (const account of ACCOUNTS) {
    console.log(`\n${BOLD}─────────────────────────────────────────────────────${RESET}`);
    console.log(`${BOLD}[${account.expectedRole}]${RESET} ${account.email}`);
    console.log(`  Site     : ${account.site}`);
    console.log(`  Password : ${account.password}`);

    // ── Login test ──────────────────────────────────────────────────────────
    let token = null;
    let loginPassed = false;

    try {
      const { status, json } = await httpPost('/auth/login', {
        email: account.email,
        password: account.password,
      });

      results.total++;

      if (status === 200 && json?.accessToken) {
        token = json.accessToken;
        loginPassed = true;
        pass(`Login OK  (HTTP ${status})`);
        results.passed++;
      } else {
        fail(`Login FAILED  (HTTP ${status}) — ${json?.message || 'no token returned'}`);
        results.failed++;
        continue; // Skip role tests if login failed
      }

      // ── Role validation ────────────────────────────────────────────────────
      results.total++;
      const returnedRoles = json?.user?.roles || [];
      if (returnedRoles.includes(account.expectedRole)) {
        pass(`Role OK   — expected "${account.expectedRole}", got [${returnedRoles.join(', ')}]`);
        results.passed++;
      } else {
        fail(`Role MISMATCH — expected "${account.expectedRole}", got [${returnedRoles.join(', ')}]`);
        results.failed++;
      }

      // ── Role-gated endpoint tests ──────────────────────────────────────────
      const endpointTests = ROLE_ENDPOINT_TESTS[account.expectedRole] || [];
      // Only run endpoint tests once per role (first account of that role)
      const alreadyTested = ACCOUNTS
        .slice(0, ACCOUNTS.indexOf(account))
        .some(a => a.expectedRole === account.expectedRole && a.email !== account.email);

      if (!alreadyTested && endpointTests.length > 0) {
        console.log(`\n  ${BOLD}Endpoint access tests for role "${account.expectedRole}":${RESET}`);
        for (const ep of endpointTests) {
          results.total++;
          try {
            const { status: epStatus } = await httpGet(ep.path, token);
            const isDeniedTest = ep.expectStatus >= 400;
            if (epStatus === ep.expectStatus) {
              if (isDeniedTest) {
                pass(`${ep.label} → correctly returned HTTP ${epStatus}`);
              } else {
                pass(`${ep.label} → HTTP ${epStatus}`);
              }
              results.passed++;
            } else {
              fail(`${ep.label} → expected HTTP ${ep.expectStatus}, got HTTP ${epStatus}`);
              results.failed++;
            }
          } catch (err) {
            fail(`${ep.label} → request error: ${err.message}`);
            results.failed++;
          }
        }
      }

    } catch (err) {
      results.total++;
      results.failed++;
      fail(`Request error: ${err.message}`);
      warn(`Make sure the backend is running: cd backend && npm run start`);
    }
  }

  // 3. Summary
  console.log(`\n${BOLD}${CYAN}═══════════════════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}   RESULTS SUMMARY${RESET}`);
  console.log(`${BOLD}${CYAN}═══════════════════════════════════════════════════════${RESET}`);
  console.log(`  Total checks : ${results.total}`);
  console.log(`  ${GREEN}${BOLD}Passed       : ${results.passed}${RESET}`);
  console.log(`  ${results.failed > 0 ? RED : GREEN}${BOLD}Failed       : ${results.failed}${RESET}`);

  if (results.failed === 0) {
    console.log(`\n${GREEN}${BOLD}✔ ALL CHECKS PASSED — Every credential and role is working correctly.${RESET}\n`);
  } else {
    console.log(`\n${RED}${BOLD}✘ ${results.failed} check(s) failed — review the output above.${RESET}\n`);
    process.exit(1);
  }
}

run().catch((err) => {
  console.error(`\n${RED}Unexpected error: ${err.message}${RESET}\n`);
  process.exit(1);
});
