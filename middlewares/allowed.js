module.exports = (paths = []) => (req, res, next) => {
  const isAllowed = paths.some(
    ({ path, methods }) => path === req.path && methods.includes(req.method)
  );

  if (isAllowed) {
    next();
    return;
  }

  const allowedMethods = (paths.find(({ path }) => path === req.path) || {})
    .methods;

  if (allowedMethods) {
    res.append('Allow', allowedMethods.join(', '));
    res.sendStatus(405);
  } else {
    res.sendStatus(404);
  }
};
