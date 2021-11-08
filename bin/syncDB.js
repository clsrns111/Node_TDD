const models = require("../models/models.js");

module.exports = () => {
  return models.sequelize.sync({ force: true });
};
