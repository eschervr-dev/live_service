module.exports = {
  parseMsg(action, payload = {}, metadata = {}) {
    const meta = Object.assign(
      {},
      {
        timestamp: Date.now()
      },
      metadata
    );

    return {
      meta,
      data: {
        action,
        payload
      }
    };
  },

  async createToken(user) {
    const token = this.app.jwt.sign(user, this.config.jwt.secret, {
      expiresIn: 60 * 60
    });

    this.ctx.set("new_token", token);
    this.ctx.set("Access-Control-Expose-Headers", "new_token");
    await this.setCache(user.id + "", user.info);
    return token;
  },
  verifyToken(token) {
    try {
      return this.app.jwt.verify(token, this.config.jwt.secret);
    } catch (err) {
      return null;
    }
  },

  async setCache(key, value) {
    const resutl = await this.app.redis.set(key, value, "EX", 7 * 24 * 60 * 60);
  },
  async getCache(key) {
    const resutl = await this.app.redis.get(key);
    return resutl;
  }
};


Date.prototype.format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}
