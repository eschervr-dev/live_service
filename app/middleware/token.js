const md5 = require('js-md5');

module.exports = (options, app) => {

    return async function (ctx, next) {
        const token = ctx.request.header.authorization;
        if (!token || token.length==0) {
            ctx.body = { code: -5, msg: "未登录， 请先登录" };
        } else {
            let decode;
            try {
                // 验证当前token
                decode = ctx.helper.verifyToken(token);
                if (!decode || !decode.id || !decode.info) {
                    ctx.body = { code: -5, msg: "token已过期，请登录" };
                } else if (Date.now() - decode.exp*1000 > 0) {
                    ctx.body = { code: -5, msg: "token已过期,请重新登录" };
                } else {
                    
                    const redis_token = await ctx.helper.getCache(decode.id + "");
                    if (redis_token) {
                        if (decode.info === redis_token) {
                            if (decode.exp*1000 - Date.now() < 1800 * 1000) {
                               await ctx.helper.createToken({ id: decode.id,info: redis_token });
                            }
                            await next();
                        } else {
                            ctx.body = { code: -5, msg: "用户信息发生变化,请重新登录" };
                        }
                    } else {
                        const user = await ctx.service.admin.admin.getCurrent(decode.id)
                        if (user) {
                            const info=md5(JSON.stringify(user));
                            await ctx.helper.createToken({ id: decode.id,info: info});
                            await next();
                        } else {
                            ctx.body = { code: -5, msg: "用户信息验证失败,请重新登录" };
                        }
                    }
                }

            } catch (e) {
                ctx.body = { code: -5, msg: "用户信息验证失败,请重新登录" };
            }
        }
    }
}