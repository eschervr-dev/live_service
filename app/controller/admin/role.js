"use strict";

const Controller = require("egg").Controller;

class RoleController extends Controller {
  async getList() {
    try {
      const result = await this.ctx.service.admin.role.getList();
      const modules = await this.ctx.service.admin.module.getList();
      this.ctx.body = { code: 1, data: {roles:result,modules} };
    } catch (error) {
      this.ctx.body = { code: 0, msg: "获取失败！" + error };
    }
  }

  async create() {
    try {
      const role = {
        id:this.ctx.request.body.id,
        name: this.ctx.request.body.name,
        description: this.ctx.request.body.description
      };
      const permissionList = this.ctx.request.body.permissionList;
      const result = await this.ctx.service.admin.role.create(
        role,
        permissionList
      );
      if (result == true) {
        const result = await this.ctx.service.admin.role.getList();
        const modules = await this.ctx.service.admin.module.getList();
        this.ctx.body = { code: 1, data: {roles:result,modules} };
      } else {
        this.ctx.body = { code: 0, msg: "创建失败！" + error };
      }
    } catch (error) {
      this.ctx.body = { code: 0, msg: "创建失败！" + error };
    }
  }
  async update() {
    try {
      const role = {
        id:this.ctx.request.body.id,
        name: this.ctx.request.body.name,
        description: this.ctx.request.body.description
      };
      const permissionList = this.ctx.request.body.permissionList;
      const result = await this.ctx.service.admin.role.update(
        role,
        permissionList
      );
      if (result == true) {
        const result = await this.ctx.service.admin.role.getList();
        const modules = await this.ctx.service.admin.module.getList();
        this.ctx.body = { code: 1, data: {roles:result,modules} };
      } else {
        this.ctx.body = { code: 0, msg: "更新失败！" + error };
      }
    } catch (error) {
      this.ctx.body = { code: 0, msg: "更新失败！" + error };
    }
  }
}

module.exports = RoleController;
