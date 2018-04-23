#!/usr/bin/env node

const express = require('express');
const getCurrentIp = require('./helpers/getCurrentIp');
const getCurrentTime = require('./helpers/getCurrentTime');
const validateUrl = require('./helpers/validateUrl');
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
app.use(express.json());

app.post(allowedPaths[0].path, (req, res) => {
  res.append('Access-Control-Allow-Origin', '*');

  if (!req.body.url) {
    res.status(400).send('Expected "url" as a parameter');
    return;
  }

  if (!validateUrl(req.body.url)) {
    res.send({
      error:
        'Wrong url format. Check that url is spelled correctly and try again'
    });
    return;
  }

  console.log('shorten req.body.url', req.body.url);
  res.send();
});

app.options(allowedPaths[0].path, (req, res) => {
  res.append('Access-Control-Allow-Origin', '*');
  res.append('Access-Control-Allow-Headers', 'Content-Type');

  res.send();
});

app.listen(PORT, () =>
  console.log(
    `[${currentTime}] express is running at http://${currentIp}:${PORT}`
  )
);
