const userModel = require('../model/user.js')
const _ = require('lodash');
module.exports = async (ctx, next) => {
    // 通过 Koa 中间件进行登录之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    if (ctx.state.$wxInfo.loginState) {
        ctx.state.data = ctx.state.$wxInfo.userinfo
        ctx.state.data['time'] = Math.floor(Date.now() / 1000)
        const user = await userModel.getUser(ctx.state.$wxInfo.userinfo.userinfo.openId);
        ctx.state.data['hasUser'] = !_.isEmpty(user);
    }
}

