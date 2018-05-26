const { mysql } = require('../qcloud')

async function apply(ctx, next) {
  const order = ctx.request.body
  const createdTime  = Date.now()
  Object.assign(order, { createdTime, userId: 'sample', orderStatus: 1})
  const result = await mysql('orders').insert(order)
  ctx.body = result
}

async function getAll(ctx, next) {
  const result = await mysql('orders').select('*')
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
    result = await mysql('orders').select('*').where({ orderStatus }).andWhere('companyName', 'like', '%' + searchText + '%').orWhere('legalEntity', 'like', '%' + searchText + '%')
  } else if(searchText){
    result = await mysql('orders').select('*').where('companyName', 'like', '%' + searchText + '%').orWhere('legalEntity', 'like', '%' + searchText + '%')
  } else if (orderStatus != '99'){
    result = await mysql('orders').select('*').where({ orderStatus })
  } else {
    result = await mysql('orders').select('*')
  }
  ctx.body = result
}

async function updateOrder(ctx, next) {
  const order = ctx.request.body
  return await mysql('orders').update(order).where({id: order.id})
}

module.exports = {
  apply,
  getAll,
  getOrders,
  getOrder,
  updateOrder
}
