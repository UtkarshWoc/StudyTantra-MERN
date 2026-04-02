import fs from 'fs';

async function test() {
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email: 'test@example.com', password: 'password123'})
  });
  const user = await loginRes.json();
  if(!user.token) { console.log('Login failed', user); return; }
  
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  let body = '--' + boundary + '\r\n';
  body += 'Content-Disposition: form-data; name="title"\r\n\r\n';
  body += 'Test Document\r\n';
  body += '--' + boundary + '\r\n';
  body += 'Content-Disposition: form-data; name="document"; filename="test.pdf"\r\n';
  body += 'Content-Type: application/pdf\r\n\r\n';
  body += '%PDF-1.4\nTest\r\n';
  body += '--' + boundary + '--\r\n';
  
  const uploadRes = await fetch('http://localhost:5000/api/documents', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + user.token,
      'Content-Type': 'multipart/form-data; boundary=' + boundary
    },
    body: Buffer.from(body)
  });
  
  const result = await uploadRes.json();
  console.log('UPLOAD STATUS:', uploadRes.status);
  console.log('UPLOAD RESULT:', result);
}
test().catch(console.error);
