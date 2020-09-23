const db = require("../db");

module.exports = app => {
  const { STRING, INTEGER, DATE, BOOLEAN, UUID } = app.Sequelize;

  const Module = db.defineModel(app, "module", {
    name: STRING(50),
    title: STRING(50),
    icon: STRING(50),
    parent_id: UUID,
    level: INTEGER,
    to: STRING(50),
    tag:{
      type:INTEGER, autoIncrement: true ,unique:'tag',
    }
  });

  Module.associate = function() {
    
    // Module.hasMany(app.model.Product, {
    //   foreignKey: "project_id",
    //   constraints: false
    // });

    // 与role表是多对多关系
    Module.belongsToMany(app.model.Admin.Role, {
      through: app.model.Admin.Permission,
      foreignKey: "module_id",
      otherKey: "role_id",
      constraints: false
    });
  };
  return Module;
};
