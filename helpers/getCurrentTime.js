const getCurrentTime = () => new Date().toTimeString().split(' ')[0];

module.exports = getCurrentTime;
