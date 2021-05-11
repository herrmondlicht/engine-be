export const respondError = (next, e) => {
  next(e);
};

const list = ({ resourceService }) => async (req, res, next) => {
  try {
    const resourceList = await resourceService.getList({ ...req.query, resourcesJoinIds: req.resourcesJoinIds });
    return res.status(200).json({
      data: resourceList,
    });
  } catch (e) {
    return respondError(next, e);
  }
};

const byId = ({ resourceService }) => async (req, res, next) => {
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

const create = ({ resourceService }) => async (req, res, next) => {
  try {
    const { body, resourcesJoinIds } = req;
    const resource = await resourceService.insert({ ...body, ...resourcesJoinIds });
    return res.status(200).json({
      created: true,
      data: resource,
    });
  } catch (e) {
    return respondError(next, e);
  }
};

const update = ({ resourceService }) => async (req, res, next) => {
  try {
    const {
      body: { id, ...bodyToUpdate },
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

const deleteResource = ({ resourceService }) => async (req, res, next) => {
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
  list: list({ resourceService }),
  byId: byId({ resourceService }),
  create: create({ resourceService }),
  update: update({ resourceService }),
  delete: deleteResource({ resourceService }),
});
