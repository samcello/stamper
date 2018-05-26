var config = require('../../../config')
var util = require('../../../utils/util.js')
let dict = require('../../../utils/dict.js')
const App = getApp()

const data = {
  order: {}
}
Page({

  /**
   * 页面的初始数据
   */
  data,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.WxValidate = App.WxValidate({
      companyName: {
        required: true
      },
      legalEntity: {
        required: true
      },
      creditCode: {
        required: true
      }
    }, {
        companyName: {
          required: '请输入企业名称',
        },
        legalEntity: {
          required: '请输入企业法人',
        },
        creditCode: {
          required: '请输入信用代码',
        }
      })
    const that = this
    this.orderId = options.orderId
    wx.request({
      url: config.service.getOrderUrl,
      header: {
        'content-type': 'application/json'
      },
      data: { id: that.orderId},
      success: function (res) {
        console.log(res.data)
        for (let order of res.data) {
          order.createdTime = util.formatTime(new Date(order.createdTime))
          order.fetchType = dict.fetchTypes[order.fetchType]
          order.orderStatus = dict.orderStatus[order.orderStatus]
          order.payStatus = dict.payStatus[order.payStatus]
          order.payType = dict.payTypes[order.payType];
          order.expressInfo = `${dict.expressCompany[order.expressCompany]}/${order.expressNo}`
          order.stampAttachments = [
            { label: '营业执照', name: 'businessLicenseUrl', value: '0', url: order.businessLicenseUrl },
            { label: '法人身份证-正面', name: 'legalIdFrontUrl', value: '1', url: order.legalIdFrontUrl },
            { label: '法人身份证-反面', name: 'legalIdBackUrl', value: '2', url: order.legalIdBackUrl },
            { label: '委托书', name: 'mandateUrl', value: '3', url: order.mandateUrl },
            { label: '法人自拍照', name: 'selfieUrl', value: '4', url: order.selfieUrl }
          ];
          order.stampTypes = order.stampTypes.split('|').map((stampType) => dict.stampTypes[stampType]).join(', ')
          order.receiverInfo = `${order.receiverAddress}, ${order.receiverName}, ${order.receiverPhone}`
          order.payInfo = `${order.payType}${order.payStatus}`
        }
        that.setData({
          order: res.data[0]
        })
      }
    })
  },

  // 预览图片
  previewImg: function (e) {
    const previewUrl = e.currentTarget.dataset.previewUrl
    console.log(previewUrl);
    wx.previewImage({
      current: previewUrl,
      urls: [previewUrl]
    })
  },
  apply(e) {
    const data = e.detail.value
    const id = this.orderId
    console.log(data)

    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      App.WxService.showModal({
        title: '友情提示',
        content: `${error.msg}`,
        showCancel: !1,
      })
      return false
    }
    Object.assign(data, {id});
    wx.request({
      url: config.service.updateOrderUrl,
      data,
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/admin/submit/submit?id='+ id
          })
        }, 1500)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})