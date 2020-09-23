"use strict";

const Service = require("egg").Service;

class RoleService extends Service {
  async getList() {
    const result = await this.ctx.model.Admin.Role.findAll({
      include: [{ model: this.app.model.Admin.Module }]
    });
    return result;
  }
  async getRole(id) {
    const result = await this.ctx.model.Admin.Role.findByPk(id,{
      include: [{ model: this.app.model.Admin.Module }]
    });
    return result;
  }


  async create(role, permissionList) {
    let transaction;
    try {
      // 建立事务对象
      transaction = await this.ctx.model.transaction();

      await this.ctx.model.Admin.Role.create(role, { transaction });
      if (permissionList && permissionList.length > 0) {
        await this.ctx.model.Admin.Permission.bulkCreate(permissionList, {
          transaction
        });
      }

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      return false;
    }
  }
  async update(role, permissionList) {
    let transaction;
    try {
      // 建立事务对象
      transaction = await this.ctx.model.transaction();

      await this.ctx.model.Admin.Role.update(role, {
        where: {
          id: role.id
        },
        transaction
      });
      await this.ctx.model.Admin.Permission.destroy({
        where: {
          role_id: role.id
        },
        transaction
      });
      if (permissionList && permissionList.length > 0) {
        await this.ctx.model.Admin.Permission.bulkCreate(permissionList, {
          transaction
        });
      }

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      return false;
    }
  }
}

module.exports = RoleService;
