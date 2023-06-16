const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const mime = require('mime');
const checksum = require('checksum');

const server = http.createServer((req, res) => {
  let filePath = path.resolve(
    __dirname,
    path.join('www', url.fileURLToPath(`file:/${req.url}`))
  );

  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (fs.existsSync(filePath)) {
      checksum.file(filePath, (err, sum) => {
        const { ext } = path.parse(filePath);
        sum = `"${sum}"`; // etag must be quoted

        let status = 200;
        if (req.headers['if-none-match'] === sum) {
          status = 304;
        }

        res.writeHead(status, {
          'Content-Type': mime.getType(ext),
          etag: sum,
        });
        if (status === 200) {
          const fileStream = fs.createReadStream(filePath);
          fileStream.pipe(res);
        } else {
          res.end();
        }
      });
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Not Found</h1>');
  }
});

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(8080, () => {
  console.log('opened server on', server.address());
});
