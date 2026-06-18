// Using native Node fetch

async function test() {
  const loginRes = await fetch('http://localhost:5001/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'seller@example.com', password: 'password123' })
  });
  const loginJson = await loginRes.json();
  const token = loginJson.data?.accessToken;
  const userId = loginJson.data?.user?.id;
  console.log('Token:', token, 'UserId:', userId);

  try {
    const res = await fetch(`http://localhost:5001/api/v1/catalog/products?vendorId=${userId}`);
    console.log('catalogRes status:', res.status);
    const text = await res.text();
    console.log('catalogRes body sample:', text.slice(0, 100));
  } catch (e) {
    console.error('catalogRes error:', e);
  }

  try {
    const res = await fetch('http://localhost:5001/api/v1/sales/vendor/settlements', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('settlementsRes status:', res.status);
    const text = await res.text();
    console.log('settlementsRes body sample:', text.slice(0, 100));
  } catch (e) {
    console.error('settlementsRes error:', e);
  }

  try {
    const res = await fetch('http://localhost:5001/api/v1/profile/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('profileRes status:', res.status);
    const text = await res.text();
    console.log('profileRes body sample:', text.slice(0, 100));
  } catch (e) {
    console.error('profileRes error:', e);
  }
}

test().catch(console.error);
