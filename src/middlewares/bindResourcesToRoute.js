const bindResourcesToRoute = (rootResourceIdKey, { cleanPreviousResources = false } = {}) => (req, res, next) => {
  req.resourcesJoinIds = {
    ...(!cleanPreviousResources && req.resourcesJoinIds),
    [rootResourceIdKey]: req.params.id,
  };
  next();
};

export default bindResourcesToRoute;
