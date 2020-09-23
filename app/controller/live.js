"use strict";
const Controller = require("egg").Controller;
const md5 = require("js-md5");

class LiveController extends Controller {
  async index() {
    try {
      const result = await this.ctx.service.live.getList(this.ctx.request.query);
      this.ctx.body = { code: 1, data: result };
    } catch (error) {
      this.ctx.body = { code: 0, msg: "获取失败！" + error };
    }
  }

  async create() {
    try {
      const result = await this.ctx.service.live.create(this.ctx.request.body);
      this.ctx.body = { code: 1, data: result };
    } catch (error) {
      this.ctx.body = { code: 0, msg: "创建失败！" + error };
    }
  }

  async destroy() {
    try {
      const result = await this.ctx.service.live.delete({streamName:this.ctx.params.id});
      this.ctx.body = { code: 1, data: result };
    } catch (error) {
      this.ctx.body = { code: 0, msg: "删除失败！" + error };
    }
  }

  async update() {
    try {
      const params={
        isNormal:this.ctx.request.body.isNormal,
        streamName:this.ctx.params.id
      }
      const result = await this.ctx.service.live.permission(params);
      this.ctx.body = { code: 1, data: result };
    } catch (error) {
      this.ctx.body = { code: 0, msg: "设置失败！" + error };
    }
  }

  async show() {
    try {
      const result = await this.ctx.service.live.getPlayUrl({streamName:this.ctx.params.id});
      this.ctx.body = { code: 1, data: result };
    } catch (error) {
      this.ctx.body = { code: 0, msg: "获取失败！" + error };
    }
  }


  async apiGetStatus() {
    try {
      await this.ctx.service.liveLocal.apiGetStatus(this.ctx.request.body);
      this.ctx.body = { code: 0, msg: "操作成功" };
    } catch (error) {
      this.ctx.body = { code: -1, msg: "操作失败！" };
    }
  }



}

module.exports = LiveController;
