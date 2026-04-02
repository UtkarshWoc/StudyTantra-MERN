const http = require('http');
const req = http.request('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const user = JSON.parse(body);
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const postData = '--' + boundary + '\r\nContent-Disposition: form-data; name="title"\r\n\r\nTest\r\n--' + boundary + '\r\nContent-Disposition: form-data; name="document"; filename="test.pdf"\r\nContent-Type: application/pdf\r\n\r\n%PDF-1.4\nTest\r\n--' + boundary + '--\r\n';
    
    const req2 = http.request('http://localhost:5000/api/documents', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + user.token,
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res2) => {
      let b2 = '';
      res2.on('data', d => b2 += d);
      res2.on('end', () => console.log('UPLOAD RESPONSE:', b2));
    });
    req2.write(postData);
    req2.end();
  });
});
req.write(JSON.stringify({email: 'test@example.com', password: 'password123'}));
req.end();
