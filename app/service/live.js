"use strict";

const Service = require("egg").Service;
const md5 = require("js-md5");


class LiveService extends Service {
  async getList(params) {
    this.initParams(params);
    params.pushType = 0;
    const result = await this.ctx.curl(this.config.live.baseUrl + "getLiveList", {
      method: "POST",
      contentType: "json",
      data: params,
      dataType: "json",
      timeout: 3000,
    });

    if (result.status != 200) {
      throw "错误码：" + result.status;
    }
    if (result.data.code == 0) {
      const local=await this.ctx.service.liveLocal.getList();
      const list=result.data.result.list;
      if(result.data.result.list&&local){
        for(var num = 0;num<list.length;num++){
          const l=local[list[num].streamName];
          if(l){
            list[num].name=l.name;
            list[num].streamStatus=l.status;
          }
          
        }
      }
      return result.data.result;
    } else {
      throw result.data.msg;
    }
  }


  async create(params) {
    this.initParams(params);
    params.pushType = 0;

    const result = await this.ctx.curl(this.config.live.baseUrl + "createLiveUrl", {
      method: "POST",
      contentType: "json",
      data: params,
      dataType: "json",
      timeout: 3000,
    });

    if (result.status != 200) {
      throw "错误码：" + result.status;
    }
    if (result.data.code == 0) {
      await this.ctx.service.liveLocal.create({name:params.name,status:0,streamName:result.data.result.streamName});
      result.data.result.name=params.name;
      result.data.result.streamStatus=0;
      return result.data.result;
    } else {
      throw result.data.msg;
    }
  }


  async delete(params) {
    this.initParams(params);

    const result = await this.ctx.curl(this.config.live.baseUrl + "delLive", {
      method: "POST",
      contentType: "json",
      data: params,
      dataType: "json",
      timeout: 3000,
    });

    if (result.status != 200) {
      throw "错误码：" + result.status;
    }
    if (result.data.code == 0) {
      await this.ctx.service.liveLocal.delete(params.streamName);
      return result.data.result;
    } else {
      throw result.data.msg;
    }
  }


  async permission(params) {
    this.initParams(params);

    const result = await this.ctx.curl(this.config.live.baseUrl + "permission", {
      method: "POST",
      contentType: "json",
      data: params,
      dataType: "json",
      timeout: 3000,
    });

    return this.returnR(result);
  }
  async getPlayUrl(params) {
    
    this.initParams(params);
    const result = await this.ctx.curl(this.config.live.baseUrl + "getPlayUrl", {
      method: "POST",
      contentType: "json",
      data: params,
      dataType: "json",
      timeout: 3000,
    });
    
    return this.returnR(result);
  }

  initParams(params){
    params.tenantNo = this.config.live.tenantNo;
    params.time = new Date().format("yyyyMMddhhmmss");
    params.sign = this.getSign(params.time);
  }

  returnR(result){
    if (result.status != 200) {
      throw "错误码：" + result.status;
    }
    if (result.data.code == 0) {
      return result.data.result;
    } else {
      throw result.data.msg;
    }
  }

  getSign(time) {
    return md5.hex(this.config.live.tenantNo + time + this.config.live.tenantKey);
  }
}

module.exports = LiveService;
