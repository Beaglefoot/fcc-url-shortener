#!/usr/bin/env node

const express = require('express');
const getCurrentIp = require('./helpers/getCurrentIp');
const getCurrentTime = require('./helpers/getCurrentTime');

const PORT = process.argv[2] || 3000;
const currentIp = getCurrentIp();
const currentTime = getCurrentTime();

const app = express();

app.use((req, _, next) => {
  console.log(`\x1b[33m--- ${req.method} ---\x1b[0m`);
  next();
});

app.use(express.static('public'));

app.get('*', (req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, () =>
  console.log(
    `[${currentTime}] express is running at http://${currentIp}:${PORT}`
  )
);
