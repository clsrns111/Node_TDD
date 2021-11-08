const models = require("../../models/models.js");

const limitController = (req, res) => {
  req.query.limit = req.query.limit || 10;
  const limit = +req.query.limit;

  if (Number.isNaN(limit)) {
    return res.status(400).end();
  }

  models.User.findAll({ limit }).then((user) => res.json(user));
};

const deleteController = (req, res) => {
  const id = +req.params.id;
  if (Number.isNaN(+id)) {
    return res.status(400).end();
  }

  models.User.destroy({ where: { id } }).then(() => res.status(204).end());
};

const postController = (req, res) => {
  const name = req.body.name;
  if (!name) return res.status(400).end();

  models.User.create({ name })
    .then((user) => res.status(201).json(user))
    .catch((err) => res.status(409).json(err));
};

const putController = (req, res) => {
  const id = +req.params.id;

  if (Number.isNaN(id)) return res.status(400).end();

  const { name } = req.body;
  if (!name) return res.status(400).end();

  const isConflict = users.filter((user) => user.name === name).length;
  if (isConflict) return res.status(400).end();

  const user = users.filter((user) => user.id === id)[0];
  if (!user) return res.status(400).end();
  /* if (!id || !name || !user || user.name === name) {
        return res.status(400).end();
      } else {
      } */
  user.name = name;
  res.json(user);
};

const getUserController = (req, res) => {
  const { id } = req.params;

  if (Number.isNaN(+id)) {
    return res.status(400).end();
  }
  const user = models.User.findOne({ where: { id } }).then((user) => {
    if (!user) {
      return res.status(404).end();
    }
    return res.json(user);
  });
};

module.exports = {
  putController,
  getUserController,
  deleteController,
  limitController,
  postController,
};
