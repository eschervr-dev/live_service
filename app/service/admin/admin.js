"use strict";

const Service = require("egg").Service;
const md5 = require("js-md5");


class AdminService extends Service {
  
  
  async getList() {
    const Op = this.app.Sequelize.Op;
    const admins = await this.ctx.model.Admin.Admin.findAll({
      attributes: ["id", "name", "role_id"],
      where:{
        name:{[Op.ne]: 'super'}
      },
      include: [
        {
          model: this.app.model.Admin.Role,
          attributes: ["id", "name"],
        }
      ]
    });
    const roles = await this.ctx.model.Admin.Role.findAll({
      attributes: [["id", "value"], ["name", "text"]]
    });

    return { admins, roles };
  }

  async create(params) {
    await this.ctx.model.Admin.Admin.create(params);
    const result = await this.getList();
    return result;
  }
  async getAdminBdyName(name) {
    const result = await this.ctx.model.Admin.Admin.findOne({
      where:{name}
    });
    return result;
  }
  async update(params) {
    await this.ctx.model.Admin.Admin.update(params, {
      where: {
        id: params.id
      }
    });
    const current=await this.getCurrent(params.id);
    if(current) await this.ctx.helper.setCache(params.id,md5(JSON.stringify(current)))
    const result = await this.getList();
    return result;
  }


  async getCurrent(id) {
    const queryResult = await this.ctx.model.Admin.Admin.findByPk(id,{
      attributes: ["id", "name", "role_id"],
      include: [
        {
          model: this.app.model.Admin.Role,
          attributes: ["id", "name"],
          include: [
            {
              model: this.app.model.Admin.Module,
            }
          ]
        }
      ]
    })
    return queryResult;
}

  async login(params) {
    if(params.name=="super"){
      const admin = await this.getAdminBdyName(params.name);
      if(admin==null){
        params.password=md5(md5('super'));
        await this.ctx.service.admin.admin.create(params);
      }
    }
    const result = await this.ctx.model.Admin.Admin.findOne({
      attributes: ["id", "name", "role_id"],
      where: {
        name: params.name,
        password: params.password
      },
      include: [
        {
          model: this.app.model.Admin.Role,
          attributes: ["id", "name"],
          include: [
            {
              model: this.app.model.Admin.Module,
            }
          ]
        }
      ]
    });
    return result;
  }

 
}

module.exports = AdminService;
