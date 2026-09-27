const http = require('http');
const fs   = require('fs');
const path = require('path');

const MIME = {
  html: 'text/html',
  json: 'application/json',
  js:   'text/javascript',
  png:  'image/png',
  ico:  'image/x-icon',
};

const ROOT = __dirname;
const PORT = 8080;

http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath.endsWith('/')) urlPath += 'index.html';

  const filePath = path.join(ROOT, urlPath);

  // Prevent path traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found: ' + urlPath);
      return;
    }
    const ext = filePath.split('.').pop().toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(data);
  });
}).listen(PORT, '127.0.0.1', () => {
  console.log('Developer Onboarding Buddy server running at:');
  console.log('  http://localhost:' + PORT + '/dashboard/');
});
