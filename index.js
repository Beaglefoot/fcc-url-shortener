#!/usr/bin/env node

const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const { slug } = require('cuid');
const getCurrentIp = require('./helpers/getCurrentIp');
const getCurrentTime = require('./helpers/getCurrentTime');
const validateUrl = require('./helpers/validateUrl');
const logger = require('./middlewares/logger');
const allowed = require('./middlewares/allowed');
require('./models/Url');

const { MongoURI } = JSON.parse(fs.readFileSync('./.env', 'utf8'));

mongoose.Promise = global.Promise;
mongoose.connect(MongoURI);

const PORT = process.argv[2] || 3000;
const currentIp = getCurrentIp();
const currentTime = getCurrentTime();

const app = express();
const allowedPaths = [{ path: '/shorten', methods: ['POST', 'OPTIONS'] }];

app.use(logger);
app.use(allowed(allowedPaths));
app.use(express.static('public'));
app.use(express.json());

app.post(allowedPaths[0].path, ({ body: { url } }, res) => {
  res.append('Access-Control-Allow-Origin', '*');

  if (!url) {
    res.status(400).send('Expected "url" as a parameter');
    return;
  }

  if (!validateUrl(url)) {
    res.send({
      error:
        'Wrong url format. Check that url is spelled correctly and try again'
    });
    return;
  }

  const Url = mongoose.model('urls');
  const createNewRecord = () => {};

  Url.findOne({ original: url }, (err, record) => {
    if (err) {
      console.error('Failed to read from DB:', err);
      res.send({ error: 'Failed to read from DB' });
    } else {
      if (record) res.send({ shortenedUrl: record.shortId });
      else {
        const shortId = slug(url);
        new Url({ original: url, shortId }).save();

        res.send({ shortenedUrl: shortId });
      }
    }
  });
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
