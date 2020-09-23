/* eslint valid-jsdoc: "off" */

'use strict';
exports.sequelize = {
  dialect: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'Escher2016',
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

exports.redis = {
  client: {
    port: 6379,          // Redis port
    host: '127.0.0.1',   // Redis host
    password: '',
    db: 2
  }
}



