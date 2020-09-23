"use strict";
const Controller = require("egg").Controller;
const md5 = require("js-md5");

class AdminController extends Controller {
  async getList() {
    try {
      const result = await this.ctx.service.admin.admin.getList();
      this.ctx.body = { code: 1, data: result };
    } catch (error) {
      this.ctx.body = { code: 0, msg: "获取失败！" + error };
    }
  }
  async initSuper(){
    try {
      var params = {
        name: 'super',
        password: md5(md5('super')),
      };
      const admin = await this.ctx.service.admin.admin.getAdminBdyName(params.name);
      if(admin){
        params.id=admin.id
        await this.ctx.service.admin.admin.update(params);
      }else{
        await this.ctx.service.admin.admin.create(params);
      }
      this.ctx.body = { code: 1, msg: "初始化成功" };
    } catch (error) {
      this.ctx.body = { code: 0, msg: "初始化失败！" + error };
    }
  }

  async create() {
    try {
      const params = {
        name: this.ctx.request.body.name,
        password: md5(this.ctx.request.body.password),
        role_id: this.ctx.request.body.role_id
      };

      const admin = await this.ctx.service.admin.admin.getAdminBdyName(params.name);
      if(admin){
        this.ctx.body = { code: 0, msg: "管理员已存在" + error };
      }else{
        const result = await this.ctx.service.admin.admin.create(params);
        this.ctx.body = { code: 1, data: result };
      }
     
    } catch (error) {
      this.ctx.body = { code: 0, msg: "创建失败！" + error };
    }
  }
  async update() {
    try {
      var params = {
        id: this.ctx.request.body.id,
        name: this.ctx.request.body.name,
        role_id: this.ctx.request.body.role_id
      };
      if(this.ctx.request.body.password){
        params.password=md5(this.ctx.request.body.password)
      }
      const result = await this.ctx.service.admin.admin.update(params);
      this.ctx.body = { code: 1, data: result };
    } catch (error) {
      this.ctx.body = { code: 0, msg: "更新失败！" + error };
    }
  }

  async getCurrent() {
    const id = this.ctx.request.query.id;
    const result = await this.ctx.service.admin.admin.getCurrent(id);
    this.ctx.body = result;
  }

  async login() {
    try {
      
      const params = {
        name: this.ctx.request.body.name,
        password: md5(this.ctx.request.body.password)
      };
      const result = await this.ctx.service.admin.admin.login(params);
      if (result) {
        const modules = await this.ctx.service.admin.module.getList(
          result.admin_role?result.admin_role.modules:null
        );
        if (modules) {
          // 签发token
          const info = md5(JSON.stringify(result));
          await this.ctx.helper.createToken({
            id: result.id,
            info: info
          });
          const data = {
            name: result.name,
            role_id: result.role_id,
            modules: modules
          };
          this.ctx.body = { code: 1, data: data };
        } else {
          this.ctx.body = { code: 0, msg: "没有登录权限！" };
        }
      } else {
        this.ctx.body = { code: 0, msg: "用户名或密码不存在！" };
      }
    } catch (error) {
      this.ctx.body = { code: 0, msg: "登录失败！" + error };
    }
  }
}

module.exports = AdminController;
