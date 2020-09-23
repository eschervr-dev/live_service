'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  app.beforeStart(async ()=>{
    await app.model.sync({alter:true,force: false});
  })
  //用户管理
  //模块管理
  router.get('/web/admin/module/getList', controller.admin.module.getList);
  router.post('/web/admin/module/save', controller.admin.module.save);

  //角色管理
  router.get('/web/admin/role/getList', controller.admin.role.getList);
  router.post('/web/admin/role/create', controller.admin.role.create);
  router.post('/web/admin/role/update', controller.admin.role.update);

  //管理员管理
  router.get('/web/admin/admin/getList', controller.admin.admin.getList);
  router.post('/web/admin/admin/create', controller.admin.admin.create);
  router.post('/web/admin/admin/update', controller.admin.admin.update);
  router.post('/web/admin/admin/login', controller.admin.admin.login);
  router.get('/web/admin/admin/getCurrent', controller.admin.admin.getCurrent);
  router.get('/web/api/admin/admin/initSuper', controller.admin.admin.initSuper);


  // router.get('/web/live/getList', controller.live.getList);

  router.resources('live', '/web/live', controller.live);
  router.resources('video', '/web/video', controller.video);
  
  router.post('/web/api/live', controller.live.apiGetStatus);
};
