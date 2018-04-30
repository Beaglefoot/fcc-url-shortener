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

const { MongoURI, BoxURL } = JSON.parse(fs.readFileSync('./.env', 'utf8'));

mongoose.Promise = global.Promise;
mongoose.connect(MongoURI);

const PORT = process.argv[2] || 3000;
const currentIp = getCurrentIp();
const currentTime = getCurrentTime();

const app = express();
const allowedPaths = [
  { path: '/shorten', methods: ['POST', 'OPTIONS'] },
  {
    path: '/',
    methods: ['GET', 'OPTIONS']
  },
  {
    path: '*',
    methods: ['GET', 'OPTIONS']
  }
];
const optionsPaths = Object.values(allowedPaths)
  .filter(({ methods }) => methods.includes('OPTIONS'))
  .map(({ path }) => path);

app.set('view engine', 'ejs');
app.use(logger);
app.use(allowed(allowedPaths));
app.use(express.static('public'));
app.use(express.json());

app.get('/', (_, res) => {
  res.render('index', { endpoint: `${BoxURL}:${PORT}` });
});

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

  Url.findOne({ original: url })
    .then(
      record => record || new Url({ original: url, shortId: slug(url) }).save()
    )
    .then(({ shortId }) => res.send({ shortenedUrl: shortId }))
    .catch(err => {
      console.log('Failed to get record from DB:', err);
      res.sendStatus(500);
    });
});

app.get('/:shortId', (req, res) => {
  const { shortId } = req.params;
  const Url = mongoose.model('urls');

  Url.findOne({ shortId })
    .then(({ original }) => {
      res.redirect(original);
    })
    .catch(err => {
      console.log('Failed to get record from DB:', err);
      res.sendStatus(500);
    });
});

app.options(optionsPaths, (req, res) => {
  res.append('Access-Control-Allow-Origin', '*');
  res.append('Access-Control-Allow-Headers', 'Content-Type');

  res.send();
});

app.listen(PORT, () =>
  console.log(
    `[${currentTime}] express is running at http://${currentIp}:${PORT}`
  )
);
