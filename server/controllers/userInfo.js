const { mysql } = require('../qcloud')
const authUtil = require('../tools/authUtil')

async function getUser(ctx, next) {
  const {openId} = ctx.request.body
  const result = await mysql('users').where({
    openId: openId
  }).select('*')
  ctx.body = result
}
async function login(ctx, next) {
  const { body } = ctx.request;
  const result = authUtil(body)
  const {openId} = body
  if(result) {
    const existed = await mysql('users').where({
      openId
    }).select('*')
    if (existed && existed.length === 0) {
      const { openId } = body
      const createdTime = Date.now()
      const result = await mysql('users').insert({ createdTime, openid: openId, roles: 0 })
    }
  }
  ctx.body = result
}

module.exports = {
  getUser,
  login
}