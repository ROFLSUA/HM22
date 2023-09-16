const { createServer } = require('node:http');
const { readFile } = require('node:fs');
const { extname, join } = require('node:path');

const server = createServer((req, res) => {
  const filePath = req.url === '/' ? 'index.html' : req.url;
  const ext = extname(filePath);

  readFile(join(__dirname, filePath), (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        readFile(join(__dirname, '404.html'), (err, data) => {
          if (err) {
            res.writeHead(500);
            res.end('Internal Server Error');
            return;
          }
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(data);
        });
        return;
      }
      res.writeHead(500);
      res.end('Internal Server Error');
      return;
    }

    let contentType = 'text/html';
    switch (ext) {
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
        contentType = 'image/jpg';
        break;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});