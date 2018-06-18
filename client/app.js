import WxValidate from './assets/plugins/wx-validate/WxValidate'
import WxService from './assets/plugins/wx-service/WxService'

var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl)
    },
    WxValidate: (rules, messages) => new WxValidate(rules, messages),
    WxService: new WxService,
    getUserInfo() {
      return this.WxService.login()
        .then(data => {
          console.log(data)
          return this.WxService.getUserInfo()
        })
        .then(data => {
          console.log(data)
          this.globalData.userInfo = data.userInfo
          return this.globalData.userInfo
        })
    },
    globalData: {
      userInfo: null
    }
})