"use strict";

const Service = require("egg").Service;
const md5 = require("js-md5");


class VideoService extends Service {
  async getList(params) {
    this.initParams(params);

    const result = await this.ctx.curl(this.config.live.baseUrl + "getRecordList", {
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
      const live = await this.ctx.model.Live.findOne({
        where:{streamName:params.streamName}
      });
      if(live)
      result.data.result.name=live.name;
      else result.data.result.name=params.streamName;
      return result.data.result;
    } else {
      throw result.data.msg;
    }
  }


  


  async delete(params) {
    this.initParams(params);

    const result = await this.ctx.curl(this.config.live.baseUrl + "delRecordFile", {
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

module.exports = VideoService;
