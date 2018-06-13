const { mysql } = require('../qcloud')

async function getUser(openId) {
  const result = await mysql('users').where({
    openId: openId
  }).select('*')
  return result
}

module.exports = {
  getUser
}