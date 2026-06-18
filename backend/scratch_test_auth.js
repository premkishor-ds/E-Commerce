// Using native Node fetch

async function test() {
  // Login
  const loginRes = await fetch('http://localhost:5001/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'seller@example.com', password: 'password123' })
  });
  const loginJson = await loginRes.json();
  console.log('Login Result:', loginJson);

  const token = loginJson.data?.accessToken;
  console.log('Login Token:', token);

  if (!token) {
    console.log('Could not log in.');
    return;
  }

  // Profile
  const profileRes = await fetch('http://localhost:5001/api/v1/profile/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const profileJson = await profileRes.json();
  console.log('Profile Result:', profileJson);

  // Let's do the same for vendor@example.com
  const loginRes2 = await fetch('http://localhost:5001/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'vendor@example.com', password: 'password123' })
  });
  const loginJson2 = await loginRes2.json();
  const token2 = loginJson2.data?.accessToken;
  if (token2) {
    const profileRes2 = await fetch('http://localhost:5001/api/v1/profile/me', {
      headers: { 'Authorization': `Bearer ${token2}` }
    });
    const profileJson2 = await profileRes2.json();
    console.log('Vendor Profile Result:', profileJson2);
  }
}

test().catch(console.error);
