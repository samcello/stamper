const {basicAuthInfo}  = require('./constants.js')
module.exports = (authInfo) => {
  if (basicAuthInfo.username === authInfo.username && basicAuthInfo.password === authInfo.password) {
    return true
  }
}