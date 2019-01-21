const userModel = require('../model/user.js')
const config = require('../config')
const _ = require('lodash');
const request = require("request-promise");
module.exports = async (ctx, next) => {
    let { code } = ctx.query;
    let appId = config.appId;
    let secret = config.appSecret;
    let { js_code } = code;
    let opts = {
      url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${js_code}&grant_type=authorization_code`
    }
    await request(opts).then((repos)=>{ctx.body = repos.body}); 
}

