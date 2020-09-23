const db = require("../db");

module.exports = app => {
  const { STRING, INTEGER, DATE, BOOLEAN,UUID } = app.Sequelize;

  const Admin = db.defineModel(app, "admin", {
    name: STRING(50),
    password:STRING(50),
    role_id:UUID,
  });

  Admin.associate = function() {
    Admin.belongsTo(app.model.Admin.Role, {
      foreignKey: "role_id",
      constraints: false
    });
  };
  return Admin;
};
