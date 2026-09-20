const http = require('http');

const API_HOST = 'localhost';
const API_PORT = 5000;

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const headers = {
      'Content-Type': 'application/json'
    };
    if (data) headers['Content-Length'] = Buffer.byteLength(data);
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request({
      hostname: API_HOST,
      port: API_PORT,
      path: `/api${path}`,
      method,
      headers
    }, (res) => {
      let resData = '';
      res.on('data', chunk => resData += chunk);
      res.on('end', () => {
        try {
          const parsed = resData ? JSON.parse(resData) : {};
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: resData });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runHardeningTests() {
  console.log('\n======================================================');
  console.log('🛡️  ESTATESOCIAL V1 — FINAL PRODUCTION HARDENING SUITE');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(name, condition, extra = '') {
    if (condition) {
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${name} -> ${extra}`);
      failed++;
    }
  }

  try {
    // ---------------------------------------------------------
    // 1. HEALTH & CONNECTIVITY
    // ---------------------------------------------------------
    console.log('--- Phase 1: API & Server Readiness ---');
    const health = await request('GET', '/health');
    assert('API is online and responds to /api/health', health.status === 200 && health.data.status === 'ok');

    // ---------------------------------------------------------
    // 2. AUTHENTICATION & SECURITY ADVERSARIAL MATRIX
    // ---------------------------------------------------------
    console.log('\n--- Phase 2: Authentication & Attack Tests ---');

    // Test missing JWT
    const noTokenRes = await request('GET', '/auth/me');
    assert('Missing JWT returns 401 Unauthorized', noTokenRes.status === 401);

    // Test malformed JWT
    const malformedTokenRes = await request('GET', '/auth/me', null, 'malformed.token.value');
    assert('Malformed JWT returns 401 Unauthorized', malformedTokenRes.status === 401);

    // Test tampered JWT
    const tamperedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2ViMGY2ODhiZDAwMDAwMDAwMDAwMCJ9.invalidSignatureHere123';
    const tamperedRes = await request('GET', '/auth/me', null, tamperedToken);
    assert('Tampered JWT returns 401 Unauthorized', tamperedRes.status === 401);

    // Test invalid login credentials
    const badLoginRes = await request('POST', '/auth/login', {
      email: 'nonexistent_user_999@example.com',
      password: 'WrongPassword123'
    });
    assert('Invalid credentials returns 401', badLoginRes.status === 401);

    // ---------------------------------------------------------
    // 3. REGISTRATION, RESERVED USERNAMES & MASS ASSIGNMENT
    // ---------------------------------------------------------
    console.log('\n--- Phase 3: Registration & Mass Assignment Defense ---');

    // Attempt to register with reserved username
    const reservedUserRes = await request('POST', '/auth/register', {
      name: 'Hacker Admin',
      email: `hacker.${Date.now()}@example.com`,
      password: 'password123',
      username: 'admin'
    });
    assert('Registering with reserved username "admin" is blocked', reservedUserRes.status === 400);

    // Attempt role escalation during registration
    const roleHackEmail = `rolehack.${Date.now()}@example.com`;
    const roleHackRes = await request('POST', '/auth/register', {
      name: 'Role Attacker',
      email: roleHackEmail,
      password: 'password123',
      role: 'admin' // Attempting to self-assign admin
    });
    assert('Self-assigning admin role in registration is neutralized to non-admin', 
      roleHackRes.status === 201 && roleHackRes.data.user.role !== 'admin');

    // Register User A
    const userAEmail = `usera.${Date.now()}@example.com`;
    const userARes = await request('POST', '/auth/register', {
      name: 'User Alpha',
      email: userAEmail,
      password: 'password123',
      role: 'agent',
      phone: '03001112233',
      city: 'Lahore'
    });
    assert('User A registers successfully with unique handle', userARes.status === 201 && !!userARes.data.token);
    const tokenA = userARes.data.token;
    const userAId = userARes.data.user._id || userARes.data.user.id;

    // Register User B
    const userBEmail = `userb.${Date.now()}@example.com`;
    const userBRes = await request('POST', '/auth/register', {
      name: 'User Beta',
      email: userBEmail,
      password: 'password123',
      role: 'agent',
      phone: '03004445566',
      city: 'Karachi'
    });
    assert('User B registers successfully', userBRes.status === 201 && !!userBRes.data.token);
    const tokenB = userBRes.data.token;

    // Attempt mass assignment on profile update (User A tries to set verified=true & kycStatus=Approved)
    const profileHackRes = await request('PUT', '/users/profile', {
      name: 'User Alpha Modified',
      verified: true,
      kycStatus: 'Approved',
      role: 'admin'
    }, tokenA);
    assert('Profile update mass-assignment ignores protected fields (verified/kycStatus/role)', 
      profileHackRes.status === 200 && 
      profileHackRes.data.user.verified === false && 
      profileHackRes.data.user.kycStatus === 'Unverified' &&
      profileHackRes.data.user.role === 'agent'
    );

    // ---------------------------------------------------------
    // 4. IDOR & OWNERSHIP ATTACK MATRIX
    // ---------------------------------------------------------
    console.log('\n--- Phase 4: IDOR / Access Control Matrix ---');

    // User A creates a listing
    const listingCreateRes = await request('POST', '/listings', {
      title: 'User A Private 1 Kanal Luxury House in DHA Phase 5',
      description: 'Exclusive designer bungalow with solar system and imported fittings.',
      purpose: 'Sale',
      propertyType: 'House',
      city: 'Lahore',
      society: 'DHA Phase 5',
      size: 1,
      sizeUnit: 'Kanal',
      price: 85000000,
      isFeatured: true // Regular user attempting to self-feature
    }, tokenA);

    assert('User A creates property listing (isFeatured self-assignment stripped to false)', 
      listingCreateRes.status === 201 && listingCreateRes.data.listing.isFeatured === false);
    const listingAId = listingCreateRes.data.listing._id;

    // User B attempts IDOR attack on User A's listing (PUT update)
    const idorUpdateRes = await request('PUT', `/listings/${listingAId}`, {
      price: 1000,
      title: 'Hacked Property Price'
    }, tokenB);
    assert('IDOR Attack: User B cannot modify User A listing (403 Forbidden)', idorUpdateRes.status === 403);

    // User B attempts IDOR attack on User A's listing (DELETE)
    const idorDeleteRes = await request('DELETE', `/listings/${listingAId}`, null, tokenB);
    assert('IDOR Attack: User B cannot delete User A listing (403 Forbidden)', idorDeleteRes.status === 403);

    // User A can legitimately update their own listing
    const legitimateUpdate = await request('PUT', `/listings/${listingAId}`, {
      price: 90000000
    }, tokenA);
    assert('Legitimate Owner: User A can update their own listing', 
      legitimateUpdate.status === 200 && legitimateUpdate.data.listing.price === 90000000);

    // ---------------------------------------------------------
    // 5. KYC & IDENTITY SECURITY AUDIT
    // ---------------------------------------------------------
    console.log('\n--- Phase 5: KYC Verification & Admin Security ---');

    // Non-admin attempts to view admin verification queue
    const nonAdminKycRes = await request('GET', '/users/admin/verifications', null, tokenA);
    assert('Non-admin cannot access Admin KYC queue (403 Forbidden)', nonAdminKycRes.status === 403);

    // User A submits KYC documents
    const kycSubmitRes = await request('POST', '/users/kyc', {
      cnic: '35201-1234567-9',
      ntn: '7890123-4',
      certificateType: 'DHA Registered Agent',
      documentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c'
    }, tokenA);
    assert('User submits KYC documents (enters Pending state, verified=false)', 
      kycSubmitRes.status === 200 && 
      kycSubmitRes.data.user.kycStatus === 'Pending' && 
      kycSubmitRes.data.user.verified === false
    );

    // User B attempts to approve User A's verification
    const idorKycApprove = await request('PUT', `/users/admin/verifications/${userAId}`, {
      action: 'approve'
    }, tokenB);
    assert('Non-admin cannot approve KYC verifications (403 Forbidden)', idorKycApprove.status === 403);

    // ---------------------------------------------------------
    // 6. PUBLIC DATA PRIVACY AUDIT
    // ---------------------------------------------------------
    console.log('\n--- Phase 6: Public Data Privacy & Leakage Audit ---');

    // Public lookup of User A profile
    const publicProfile = await request('GET', `/users/${userAId}`);
    assert('Public profile lookup succeeds', publicProfile.status === 200 && !!publicProfile.data.user);
    assert('Privacy: Password hash is absent from public profile', publicProfile.data.user.password === undefined);
    assert('Privacy: Sensitive kycData / CNIC is absent from public profile', publicProfile.data.user.kycData === undefined);

    // Public lookup of listing details
    const publicListing = await request('GET', `/listings/${listingAId}`);
    assert('Public listing details query succeeds', publicListing.status === 200 && !!publicListing.data.listing);
    assert('Privacy: Creator sub-document does NOT leak kycData or password', 
      publicListing.data.listing.creator?.kycData === undefined && 
      publicListing.data.listing.creator?.password === undefined
    );

    // ---------------------------------------------------------
    // 7. INPUT SECURITY, MALFORMED IDS & PAGINATION
    // ---------------------------------------------------------
    console.log('\n--- Phase 7: Input Security & Boundary Checks ---');

    // Malformed ObjectId lookup
    const malformedIdRes = await request('GET', '/listings/invalid-id-xyz-123');
    assert('Malformed ObjectId does not trigger 500 error (returns 404 safely)', malformedIdRes.status === 404);

    // Non-existent 24-char ObjectId
    const nonExistentIdRes = await request('GET', '/listings/507f1f77bcf86cd799439011');
    assert('Non-existent ObjectId returns 404 cleanly', nonExistentIdRes.status === 404);

    // Extreme pagination limit check
    const paginationRes = await request('GET', '/listings?limit=99999');
    assert('Pagination limit is safely bounded (capped at 50 max)', 
      paginationRes.status === 200 && paginationRes.data.limit <= 50);

    // Regex injection attempt in search query
    const regexAttackRes = await request('GET', '/listings?city=Lahore.*&search=.*');
    assert('Regex search parameters are escaped without crashing the query', regexAttackRes.status === 200);

    // ---------------------------------------------------------
    // 8. CLEANUP & DELETION
    // ---------------------------------------------------------
    console.log('\n--- Phase 8: Cleanup & Legitimate Deletion ---');
    const deleteRes = await request('DELETE', `/listings/${listingAId}`, null, tokenA);
    assert('Legitimate Owner: User A can delete their own listing', deleteRes.status === 200);

  } catch (err) {
    console.error('❌ Unexpected test error:', err);
    failed++;
  }

  console.log('\n======================================================');
  console.log(`🎯 HARDENING TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runHardeningTests();
