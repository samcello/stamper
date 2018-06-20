const { mysql } = require('../qcloud')

async function apply(ctx, next) {
  const order = ctx.request.body
  const createdTime  = Date.now()
  Object.assign(order, { createdTime, orderStatus: 1, orderId: createdTime})
  const result = await mysql('orders').insert(order)
  ctx.body = result
}

async function getAll(ctx, next) {
  const result = await mysql('orders').select('*').orderBy('createdTime', 'desc')
  ctx.body = result
}

async function getOrder(ctx, next) {
  const {id} = ctx.query
  const result = await mysql('orders').select('*').where({id})
  ctx.body = result
}

async function getOrders(ctx, next) {
  const { orderStatus, searchText } = ctx.query;
  let result = [];
  if (searchText && orderStatus != '99') {
    result = await mysql('orders').select('*').where({ orderStatus }).andWhere('companyName', 'like', '%' + searchText + '%').orWhere('legalEntity', 'like', '%' + searchText + '%').orderBy('createdTime', 'desc')
  } else if(searchText){
    result = await mysql('orders').select('*').where('companyName', 'like', '%' + searchText + '%').orWhere('legalEntity', 'like', '%' + searchText + '%').orderBy('createdTime', 'desc')
  } else if (orderStatus != '99'){
    result = await mysql('orders').select('*').where({ orderStatus }).orderBy('createdTime', 'desc')
  } else {
    result = await mysql('orders').select('*').orderBy('createdTime', 'desc')
  }
  ctx.body = result
}

async function updateOrder(ctx, next) {
  const order = ctx.request.body
  return await mysql('orders').update(order).where({id: order.id})
}

async function getOrdersByUser(ctx, next) {
  const { openId } = ctx.query
  const result = await mysql('orders').select('*').where({ userId: openId}).orderBy('createdTime', 'desc')
  ctx.body = result
}

module.exports = {
  apply,
  getAll,
  getOrders,
  getOrder,
  updateOrder,
  getOrdersByUser
}
