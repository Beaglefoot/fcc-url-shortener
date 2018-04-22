const _ = require('lodash');
const os = require('os');

const getCurrentIp = () => _.chain(Object.values(os.networkInterfaces()))
  .flatten()
  .find({family: 'IPv4', internal: false})
  .value().address;

module.exports = getCurrentIp;
