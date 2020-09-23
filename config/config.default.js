/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1571713095454_10008';

  // add your middleware config here
  config.middleware = ['token','live'];

  config.token={
    ignore: ['/web/admin/admin/login','/web/api/*','/web/socket','/web/wx/*']
  }


  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };


  config.cluster = {
    listen: {
      port: 10011,
      hostname: '0.0.0.0',
    }
};

config.cors = {
  origin:'*',
  credentials: true,
  allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
};

config.live={
   baseUrl : "http://101.89.203.135:10094/live-api/api/",
   tenantNo : "3722532102",
   tenantKey : "4711d86042e9a38727ef84ba70ed0429",
   match: '/web/api/live',
}



  config.security = {
    csrf: {
      enable: false,

    },
  };

  config.redis = {
    client: {
      port: 6379,          // Redis port
      host: '10.0.0.200',   // Redis host
      password: '',
      db: 2
    }
  };

  config.sequelize = {
    dialect: 'mysql',
    host: '10.0.0.200',
    port: 3306,
    username: 'guogc',
    password: '123456',
    database: 'dx_live',
    timezone: '+08:00',
    define: {  // model的全局配置
      freezeTableName: true,  // 防止修改表名为复数
      underscored: false  // 防止驼峰式字段被默认转为下划线
    },
    dialectOptions: {  // 让读取date类型数据时返回字符串而不是UTC时间
      dateStrings: true,
      typeCast(field, next) {
          if (field.type === "DATETIME") {
              return field.string();
          }
          return next();
      }
    }
  };

  return {
    ...config,
    ...userConfig,
  };
};
