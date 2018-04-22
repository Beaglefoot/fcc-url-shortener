#!/usr/bin/env node

const express = require('express');
const getCurrentIp = require('./helpers/getCurrentIp');
const getCurrentTime = require('./helpers/getCurrentTime');

const PORT = process.argv[2] || 3000;
const currentIp = getCurrentIp();
const currentTime = getCurrentTime();

const app = express();
const shortenPath = '/shorten';

app.use((req, _, next) => {
  console.log(`\x1b[33m--- ${req.method} ---\x1b[0m`);
  next();
});

app.use((req, res, next) => {
  if (req.path === shortenPath) {
    res.append('Allow', 'POST, OPTIONS');

    if (req.method === 'OPTIONS') {
      res.send();
      return;
    }

    if (req.method !== 'POST') {
      res.sendStatus(405);
      return;
    }
  }

  next();
});

app.use(express.static('public'));

app.post(shortenPath, (req, res) => {
  console.log('shorten');
  res.send();
});

app.listen(PORT, () =>
  console.log(
    `[${currentTime}] express is running at http://${currentIp}:${PORT}`
  )
);
