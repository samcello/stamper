const { mysql } = require('../qcloud')

function client(ctx) {
  let { method, host, path, headers, query, url, href } = ctx
  let userAgent = headers['user-agent']
  let referer = headers.referer
  let reqBody = ctx.request.body

  return ({
    method,
    host,
    href,
    path,
    query: JSON.stringify(query),
    referer,
    url,
    userAgent,
    reqBody: JSON.stringify(reqBody)
  })
}

function server(ctx) {
  let { status, body } = ctx

  return ({
    status,
    resBody: JSON.stringify(body)
  })
}

module.exports = () => {
  return async (ctx, next) => {
    const startTime = new Date().getTime()
    const clientMessage = client(ctx)
    await next()
    const endTime = new Date().getTime()
    const serverMessage = server(ctx)
    const logInfo = Object.assign(clientMessage, serverMessage, { startTime, endTime});
    const result = await mysql('logs').insert(logInfo)
  }
}