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

async function runTests() {
  console.log('\n🚀 Starting EstateSocial Pakistan V1 Automated Verification Suite...\n');
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
    // 1. Health / Home check
    const health = await request('GET', '/listings?limit=5');
    assert('Listings API is operational', health.status === 200);

    // 2. Public Agent Directory
    const agentsRes = await request('GET', '/users/agents');
    assert('Agent Directory returns agents list', agentsRes.status === 200 && Array.isArray(agentsRes.data.agents));
    assert('Agent Directory has verified agents', agentsRes.data.agents.length > 0);

    // 3. Resolve Agent Profile via @handle
    const agentProfile = await request('GET', '/users/@al-haram-realtors');
    assert('Agent Profile lookup by @username handle succeeds', agentProfile.status === 200 && agentProfile.data.user.username === 'al-haram-realtors');

    // 4. Resolve Agent Inventory
    const agentListings = await request('GET', '/listings/agent/@al-haram-realtors');
    assert('Agent Inventory lookup by @username succeeds', agentListings.status === 200 && Array.isArray(agentListings.data.listings));

    // 5. Admin Login
    const adminLogin = await request('POST', '/auth/login', {
      email: 'admin@estatesocial.com',
      password: 'password123'
    });
    const adminToken = adminLogin.data.token || adminLogin.data.accessToken;
    assert('Admin login succeeds', adminLogin.status === 200 && !!adminToken, JSON.stringify(adminLogin.data));

    // 6. Admin Stats
    const statsRes = await request('GET', '/users/admin/stats', null, adminToken);
    assert('Admin Stats KPI endpoint returns metrics', statsRes.status === 200 && statsRes.data.stats && statsRes.data.stats.totalListings >= 0, JSON.stringify(statsRes.data));

    // 7. Register a New Test Agent
    const testEmail = `test.agent.${Date.now()}@example.com`;
    const regRes = await request('POST', '/auth/register', {
      name: 'Gulberg Prime Realtors',
      email: testEmail,
      password: 'password123',
      role: 'agent',
      phone: '+923001234567',
      city: 'Lahore'
    });
    const testUserToken = regRes.data.token || regRes.data.accessToken;
    const testUserId = regRes.data.user?._id || regRes.data.user?.id;
    assert('New agent registration generates @username slug', regRes.status === 201 && !!regRes.data.user?.username, JSON.stringify(regRes.data));

    // 8. Test Agent Posts a Commercial Listing
    const listingRes = await request('POST', '/listings', {
      title: 'Gulberg 3 Triple Storey Commercial Plaza',
      description: 'Prime commercial building with high footfall and 100% generator backup.',
      purpose: 'Sale',
      propertyType: 'Commercial',
      city: 'Lahore',
      society: 'Gulberg III',
      size: 10,
      sizeUnit: 'Marla',
      price: 185000000,
      rentalIncome: 850000,
      totalFloors: 'Triple Storey',
      roadWidth: '100 Ft Main Boulevard',
      features: ['Main Boulevard Frontage', '100% Standby Generator Backup']
    }, testUserToken);

    assert('Test Agent can post dynamic Commercial Listing', listingRes.status === 201 && !!listingRes.data.listing?._id, JSON.stringify(listingRes.data));
    const createdListingId = listingRes.data.listing?._id;

    // 9. Public Listing Details Fetch
    const singleListing = await request('GET', `/listings/${createdListingId}`);
    assert('Public listing details query returns full category data', singleListing.status === 200 && singleListing.data.listing?.rentalIncome === 850000, JSON.stringify(singleListing.data));

    // 10. Update Listing by Creator
    const updateRes = await request('PUT', `/listings/${createdListingId}`, {
      price: 190000000
    }, testUserToken);
    assert('Creator can update their own listing', updateRes.status === 200 && updateRes.data.listing?.price === 190000000, JSON.stringify(updateRes.data));

    // 11. IDOR Security Test: Direct Owner tries to edit Test Agent's listing
    const ownerLogin = await request('POST', '/auth/login', {
      email: 'owner@estatesocial.com',
      password: 'password123'
    });
    const ownerToken = ownerLogin.data.token || ownerLogin.data.accessToken;

    const idorRes = await request('PUT', `/listings/${createdListingId}`, {
      price: 10000
    }, ownerToken);
    assert('IDOR Protection: Unauthorized user cannot edit another user listing', idorRes.status === 403 || idorRes.status === 401, JSON.stringify(idorRes.data));

    // 12. Submit KYC Document
    const kycSubmitRes = await request('POST', '/users/kyc', {
      cnic: '35201-9876543-1',
      ntn: '8899123-0 (FBR Filer)',
      certificateType: 'DHA Lahore Registered Realtor #2099',
      docUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c'
    }, testUserToken);
    assert('User can submit KYC verification request', kycSubmitRes.status === 200 && kycSubmitRes.data.user?.kycStatus === 'Pending', JSON.stringify(kycSubmitRes.data));

    // 13. Admin Verification Queue
    const adminKycQueue = await request('GET', '/users/admin/verifications', null, adminToken);
    assert('Admin can view pending KYC verification queue', adminKycQueue.status === 200 && Array.isArray(adminKycQueue.data.verifications), JSON.stringify(adminKycQueue.data));

    // 14. Admin Approves KYC
    const approveKyc = await request('PUT', `/users/admin/verifications/${testUserId}`, {
      action: 'approve'
    }, adminToken);
    assert('Admin can approve KYC and grant verified badge', approveKyc.status === 200 && approveKyc.data.user?.verified === true, JSON.stringify(approveKyc.data));

    // 15. Clean up created listing
    const deleteRes = await request('DELETE', `/listings/${createdListingId}`, null, testUserToken);
    assert('Creator can delete their own listing', deleteRes.status === 200, JSON.stringify(deleteRes.data));

  } catch (err) {
    console.error('Unexpected error during testing:', err);
    failed++;
  }

  console.log(`\n========================================`);
  console.log(`🎯 Test Summary: ${passed} Passed | ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
