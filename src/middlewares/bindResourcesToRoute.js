const bindResourcesToRoute = (resourceNames = [], rootResourceIdKey) => (req, res, next) => {
  if (!req.query.include) {
    req.query.include = resourceNames.join();
  }
  req.query = {
    ...req.query,
    include: req.query.include
      .split(',')
      .filter((str) => !resourceNames.includes(str))
      .concat(resourceNames)
      .join(),
  };
  req.injectedQuery = {
    ...req.injectedQuery,
    [rootResourceIdKey]: req.params.id,
  };
  next();
};

export default bindResourcesToRoute;
