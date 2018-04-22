#!/usr/bin/env node

const express = require('express');
const getCurrentIp = require('./helpers/getCurrentIp');
const getCurrentTime = require('./helpers/getCurrentTime');
const logger = require('./middlewares/logger');
const allowed = require('./middlewares/allowed');

const PORT = process.argv[2] || 3000;
const currentIp = getCurrentIp();
const currentTime = getCurrentTime();

const app = express();
const allowedPaths = [{ path: '/shorten', methods: ['POST', 'OPTIONS'] }];

app.use(logger);
app.use(allowed(allowedPaths));
app.use(express.static('public'));

app.post(allowedPaths[0].path, (req, res) => {
  console.log('shorten');
  res.send();
});

app.listen(PORT, () =>
  console.log(
    `[${currentTime}] express is running at http://${currentIp}:${PORT}`
  )
);
