const matcher = require('matcher');

module.exports = (paths = []) => (req, res, next) => {
  const allowed = paths.find(({ path, methods }) =>
    matcher.isMatch(req.path, path)
  );

  if (!allowed) {
    res.sendStatus(404);
    next();
    return;
  }

  if (allowed.methods.includes(req.method)) {
    if (req.method === 'OPTIONS') {
      res.append('Allow', allowed.methods.join(', '));
    }
    next();
    return;
  }

  res.sendStatus(405);
};
