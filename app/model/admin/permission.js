const db = require("../db");

module.exports = app => {
  const { STRING, INTEGER, DATE, BOOLEAN,UUID } = app.Sequelize;

  const Permission = db.defineModel(app, "admin_permission", {
    role_id: {
      type:UUID,
      primaryKey: true
    },
    module_id: {
      type:UUID,
      primaryKey: true
    },
    crud: INTEGER,
  });

  Permission.associate = function() {
  };
  return Permission;
};
