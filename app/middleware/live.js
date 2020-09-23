const md5 = require("js-md5");

module.exports = (options, app) => {
  return async function (ctx, next) {
    try {
      const tenantNo = ctx.request.body.tenantNo;
      const time = ctx.request.body.time;
      const s = ctx.request.body.sign;
      if (app.config.live.tenantNo != tenantNo) {
        ctx.body = { code: -1, msg: "tenantNo并不匹配" };
      } else {
        const sign = md5.hex(
            app.config.live.tenantNo + time + app.config.live.tenantKey
        );
        if (sign != s) {
          ctx.body = { code: -1, msg: "sign错误" };
        } else {
          await next();
        }
      }
    } catch (error) {
        ctx.body = { code: -1, msg: "参数解析错误" };
    }
  };
};
