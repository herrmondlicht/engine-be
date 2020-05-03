const bindResourcesToRoute = (rootResourceIdKey) => (req, res, next) => {
  req.injectedQuery = {
    ...req.injectedQuery,
    [rootResourceIdKey]: req.params.id,
  };
  next();
};

export default bindResourcesToRoute;
