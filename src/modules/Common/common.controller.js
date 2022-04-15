export const respondError = (next, e) => {
  next(e);
};

const makeList = ({ resourceService }) => async (req, res, next) => {
  try {
    const resourceList = await resourceService.getList({ ...req.query, resourcesJoinIds: req.resourcesJoinIds });
    return res.status(200).json({
      data: resourceList,
    });
  } catch (e) {
    return respondError(next, e);
  }
};

const makeGetById = ({ resourceService }) => async (req, res, next) => {
  try {
    const resourceList = await resourceService.getList({ ...req.query, q: { id: req.params.id, ...req.resourcesJoinIds } });
    if (resourceList.length) {
      return res.status(200).json({
        data: resourceList[0],
      });
    }
    return res.status(404).json({
      message: 'resource was not found',
    });
  } catch (e) {
    return respondError(next, e);
  }
};

const makeCreate = ({ resourceService }) => async (req, res, next) => {
  try {
    const {
      body: { created_at, updated_at, ...payload },
      resourcesJoinIds,
    } = req;
    const resource = await resourceService.insert({ ...payload, ...resourcesJoinIds });
    return res.status(200).json({
      created: true,
      data: resource,
    });
  } catch (e) {
    return respondError(next, e);
  }
};

const makeUpdateMethod = ({ resourceService }) => async (req, res, next) => {
  try {
    const {
      body: { id, created_at, updated_at, ...bodyToUpdate },
      params: { id: updateId },
    } = req;
    const resource = await resourceService.update(updateId, bodyToUpdate);
    return res.status(200).json({
      updated: true,
      data: resource,
    });
  } catch (e) {
    return respondError(next, e);
  }
};

const makeDeleteResource = ({ resourceService }) => async (req, res, next) => {
  try {
    const {
      params: { id: updateId },
    } = req;
    const resource = await resourceService.update(updateId, { deleted_at: new Date() });
    return res.status(200).json({
      deleted: true,
      data: resource,
    });
  } catch (e) {
    return respondError(next, e);
  }
};

export default ({ resourceService }) => ({
  list: makeList({ resourceService }),
  byId: makeGetById({ resourceService }),
  create: makeCreate({ resourceService }),
  update: makeUpdateMethod({ resourceService }),
  delete: makeDeleteResource({ resourceService }),
});
