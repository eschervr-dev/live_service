"use strict";

const Service = require("egg").Service;


class LiveLocalService extends Service {
  async getList() {
    const result = await this.ctx.model.Live.findAll();
    if(result){
      const obj={};
      result.forEach(element => {
        obj[element.streamName]=element;
      });
      return obj;
    }
    return result;
  }


  async create(params) {

    const result = await this.ctx.model.Live.create(params);
    return result;
  }


  async delete(streamName) {
    const result = await this.ctx.model.Live.destroy({
      where:{streamName}
    });
    return result;
  }

  async apiGetStatus(params) {
    const live = await this.ctx.model.Live.findOne({
      where:{streamName:params.streamName}
    });
    if(live){
      await live.update({ status: params.status});
    }
    return live;
  }

}

module.exports = LiveLocalService;
