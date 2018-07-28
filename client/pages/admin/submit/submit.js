var config = require('../../../config')
var util = require('../../../utils/util.js')
let dict = require('../../../utils/dict.js')
const App = getApp()
const orderStatusMapping = {
  0: 4,
  1: 5,
  2: 6
}

const data = {
  form: {
    orderStatusIndex: 0,
    payStatusIndex: 0,
    expressIndex: 0,
    comments: ''
  },
  orderStatus: ['已发货', '已退回', '已完成'],
  payStatus: ['未支付', '已支付'],
  expressCompany: ['顺丰速运'],
  verifyPass: true,
  submitted: false
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
    this.orderId = options.id
    const that = this
    wx.request({
      url: config.service.getOrderUrl,
      header: {
        'content-type': 'application/json'
      },
      data: { id: that.orderId },
      success: function (res) {
        that.setData({
          order: res.data[0],
          verifyPass: res.data[0].orderStatus != 5,
          'form.orderStatusIndex': util.reverse(orderStatusMapping)[res.data[0].orderStatus],
          'form.payStatusIndex': res.data[0].payStatus,
          'form.comments': res.data[0].comments
        })
      }
    })
  },

  bindOrderStatusChange: function (e) {
    const status = e.detail.value
    this.setData({
      'form.orderStatusIndex': status
    })
    if (status === '0') this.setData({ verifyPass: true})
    else this.setData({ verifyPass: false })
  },

  bindPayStatusChange: function (e) {
    const status = e.detail.value
    this.setData({
      'form.payStatusIndex': status
    })
  },

  expressChange(e) {
    this.setData({
      'form.expressIndex': e.detail.value
    })
  },

  submit(e) {
    const that = this
    const data = e.detail.value
    const id = this.orderId
    Object.assign(data, { id }, { orderStatus: orderStatusMapping[this.data.form.orderStatusIndex]}, {expressCompany: this.data.form.expressIndex, payStatus: this.data.form.payStatusIndex });
    this.setData({
      submitted: true
    })
    wx.showLoading({
      title: '处理中',
      mask: true,
    })
    wx.request({
      url: config.service.updateOrderUrl,
      data,
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/admin/home/home',
            success: function () {
              that.setData({
                submitted: false
              })
              wx.hideLoading()
            }
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