const db = require("./db");

module.exports = app => {
  const { STRING, INTEGER, DATE, BOOLEAN,UUID } = app.Sequelize;

  const Live = db.defineModel(app, "live", {
    name: STRING(50),
    streamName: STRING(50),
  });

  return Live;
};
