const { mysql } = require('../qcloud')

async function apply(ctx, next) {
  const order = ctx.request.body
  const createdTime  = Date.now()
  Object.assign(order, { createdTime})
  const result = await mysql('stamper').insert(ctx.request.body)
  ctx.body = result
}

async function getAll(ctx, next) {
  const result = await mysql('stamper').select('*')
  ctx.body = result
}

module.exports = {
  apply,
  getAll
}
