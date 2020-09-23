const db = require("../db");

module.exports = app => {
  const { STRING, INTEGER, DATE, BOOLEAN,UUID } = app.Sequelize;

  const Role = db.defineModel(app, "admin_role", {
    name: STRING(50),
    description: STRING(256),
    level:INTEGER,
  });

  Role.associate = function() {
    Role.belongsToMany(app.model.Admin.Module,{
      through: app.model.Admin.Permission,
      foreignKey: 'role_id',
      otherKey: 'module_id',
      constraints: false
    });

    Role.hasMany(app.model.Admin.Admin,{
      foreignKey: 'role_id',
      constraints: false
    });
  };
  return Role;
};
