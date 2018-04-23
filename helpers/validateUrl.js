module.exports = (url = '') =>
  /(https?|ftp):\/\/(-\.)?([^\s/?\.#-]+\.?)+(\/[^\s]*)?$/i.test(url);
