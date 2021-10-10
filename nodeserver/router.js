const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

fs.readdirSync(path.join(__dirname, '/routes')).forEach(file => {
  require('./routes/' + file)(router);
});

module.exports = router;
