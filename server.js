const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const server = http.createServer(function(req, res) {

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  var uri = url.parse(req.url).pathname;
  var filename = path.join(process.cwd(), uri);
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST') {
    var body = '';
    req.on('data', function(data) {
      body += data;
    });
    req.on('end', function() {
      fs.appendFile('data.txt', body + '\n', function(err) {
        if (err) throw err;
        console.log('Data saved:', body);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<html><body><h1>Data Saved</h1></body></html>');
      });
    });
  } else {
    fs.readFile(filename, "binary", function(err, file) {
      if (err) {
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.write("404 Not Found\n");
        res.end();
        return;
      }
      res.writeHead(200);
      res.write(file, "binary");
      res.end();
    });
  }
});

server.listen(3000);
console.log('Server running at http://localhost:3000/');
