"use strict";

const Service = require("egg").Service;

class ModuleService extends Service {
  async getList(modules) {
    const result = await this.app.model.Admin.Module.findAll({
      order: [["level", "DESC"], ["tag", "ASC"]]
    });
    var admin_modles = {};
    if (modules) {
      modules.forEach(element => {
        if (element.level == 1)
          admin_modles[element.id] = element.admin_permission.crud;
        else {
          if (!admin_modles[element.parent_id]) {
            admin_modles[element.parent_id] = 0;
            admin_modles[element.id] = element.admin_permission.crud;
          } else admin_modles[element.id] = element.admin_permission.crud;
        }
      });
    }
    
    var moduleList = [];
    var scondModule = {};
    if (result && result.length > 0) {
      result.forEach(i => {
        const admin = admin_modles[i.id];
        
        if (!modules || admin>-1) {
          if (admin>-1) i.dataValues.crud = admin;
          
          if (i.level == 2) {
            var first = scondModule[i.parent_id];
            if (first) {
              first.push(i);
            } else {
              scondModule[i.parent_id] = [];
              scondModule[i.parent_id].push(i);
            }
          } else {
            
            i.dataValues.items = scondModule[i.id];
            moduleList.push(i);
            
          }
        }
      });
    }
    return moduleList;
  }

  async save(createList, updateList, deleteList) {
    const Op = this.app.Sequelize.Op;
    let transaction;
    try {
      // 建立事务对象
      transaction = await this.ctx.model.transaction();

      // 事务删操作
      if (deleteList && deleteList.length > 0) {
        await this.ctx.model.Admin.Module.destroy({
          where: {
            id: { [Op.in]: deleteList }
          },
          transaction
        });
        await this.ctx.model.Admin.Permission.destroy({
          where: {
            module_id: { [Op.in]: deleteList }
          },
          transaction
        });
      }
      if (createList && createList.length > 0) {
        await this.ctx.model.Admin.Module.bulkCreate(createList, {
          transaction
        });
      }

      if (updateList && updateList.length > 0) {
        for (const key in updateList) {
          const element = updateList[key];
          await this.ctx.model.Admin.Module.update(element, {
            where: {
              id: element.id
            },
            transaction
          });
        }
      }

      await transaction.commit();
      const result = await this.getList();
      return result;
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      return null;
    }
  }
}

module.exports = ModuleService;
