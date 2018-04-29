const matcher = require('matcher');

module.exports = (paths = []) => (req, res, next) => {
  const allowed = paths.find(
    ({ path, methods }) =>
      matcher.isMatch(req.path, path) && methods.includes(req.method)
  );

  if (!allowed) {
    next();
    return;
  }

  if (allowed.methods) {
    res.append('Allow', allowed.methods.join(', '));
    res.sendStatus(405);
  } else {
    res.sendStatus(404);
  }
};
