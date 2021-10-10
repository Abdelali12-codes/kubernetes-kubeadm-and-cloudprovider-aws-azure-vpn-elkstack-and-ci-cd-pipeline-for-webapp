#!/usr/bin/env node

const app = require('./app');
const http = require('http');

const port = 3001;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Listening on ${port}.`)
});
