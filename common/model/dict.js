const stampTypes = {
  0: '公章',
  1: '发票章',
  2: '财务章',
  3: '法人章',
  4: '合同章'
}

const otherStampTypes: {
  0: '人事专用章',
  1: '行政专用章',
  2: '报关专用章',
  3: '中英文翻译章',
  4: '质检专用章',
}

const fetchTypes = {
  0: '自取',
  1: '快递'
}

const payTypes = {
  0: '微信'
}

const payStatus = {
  0: '未支付',
  1: '已支付'
}

const orderStatus = {
  0: '已提交',
  1: '审核中',
  2: '审核通过',
  3: '审核未通过',
  4: '已发货'
}

const expressCompany = {
  0: '顺丰速运'
}

const userType = {
  0: 'admin',
  1: 'user',
  2: 'customer'
}

module.exports = {
  stampTypes,
  fetchTypes,
  payTypes,
  otherStampTypes
}