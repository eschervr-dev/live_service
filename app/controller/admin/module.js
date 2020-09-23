'use strict';

const Controller = require('egg').Controller;

class ModuleController extends Controller {
  async getList() {
      try {
        const result=await this.ctx.service.admin.module.getList();
        this.ctx.body={code:1,data:result};
      } catch (error) {
        this.ctx.body={code:0,msg:"获取失败！"+error};
      }
    
  }

  async save(){
    const createList=this.ctx.request.body.createList;
    const updateList=this.ctx.request.body.updateList;
    const deleteList=this.ctx.request.body.deleteList;
    try {
      const result=await this.ctx.service.admin.module.save(createList,updateList,deleteList);
      if(result){
        this.ctx.body={code:1,msg:"保存成功！",data:result};
      }else{
        this.ctx.body={code:0,msg:"保存失败！"};
      }
      
    } catch (error) {
      this.ctx.body={code:0,msg:"保存失败！"+error};
    }

  }
  
}

module.exports = ModuleController;
