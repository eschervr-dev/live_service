"use strict";
const Controller = require("egg").Controller;
const md5 = require("js-md5");

class LiveController extends Controller {
  async index() {
    try {
      const result = await this.ctx.service.video.getList(this.ctx.request.query);
      this.ctx.body = { code: 1, data: result };
    } catch (error) {
      this.ctx.body = { code: 0, msg: "获取失败！" + error };
    }
  }


  async destroy() {
    try {
      const result = await this.ctx.service.video.delete({streamName:this.ctx.params.id,fileName:this.ctx.request.body.fileName});
      this.ctx.body = { code: 1, data: result };
    } catch (error) {
      this.ctx.body = { code: 0, msg: "删除失败！" + error };
    }
  }

  



}

module.exports = LiveController;
