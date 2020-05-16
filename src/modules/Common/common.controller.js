export const respondError = (res, e) =>
  res.status(500).json({
    status: 500,
    message: e.message || 'something went wrong',
  });

const list = ({ resourceService }) => async (req, res) => {
  try {
    const resourceList = await resourceService.getList({ ...req.query, resourcesJoinIds: req.resourcesJoinIds });
    return res.status(200).json({
      data: resourceList,
    });
  } catch (e) {
    return respondError(res, e);
  }
};

const byId = ({ resourceService }) => async (req, res) => {
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
    return respondError(res, e);
  }
};

const create = ({ resourceService }) => async (req, res) => {
  try {
    const { body } = req;
    const resource = await resourceService.insert(body);
    return res.status(200).json({
      created: true,
      data: resource,
    });
  } catch (e) {
    return respondError(res, e);
  }
};

const update = ({ resourceService }) => async (req, res) => {
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
    return respondError(res, e);
  }
};

const deleteResource = ({ resourceService }) => async (req, res) => {
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
    return respondError(res, e);
  }
};

export default ({ resourceService }) => ({
  list: list({ resourceService }),
  byId: byId({ resourceService }),
  create: create({ resourceService }),
  update: update({ resourceService }),
  delete: deleteResource({ resourceService }),
});
