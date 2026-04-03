const http = require('http');

const server = http.createServer((req, res) => {
  res.write('Bot is alive!');
  res.end();
});

server.listen(3000, () => {
  console.log('Keep alive server running!');
});
