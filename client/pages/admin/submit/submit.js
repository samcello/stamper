var config = require('../../../config')
var util = require('../../../utils/util.js')
let dict = require('../../../utils/dict.js')
const App = getApp()
const statusMapping = {
  0: 4,
  1: 5
}
const data = {
  form: {
    statusIndex: 0,
    expressIndex: 0,
    comments: ''
  },
  orderStatus: ['已发货', '已退回'],
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
        console.log(res.data)
        that.setData({
          order: res.data[0],
          verifyPass: res.data[0].orderStatus != 5,
          'form.statusIndex': util.reverse(statusMapping)[res.data[0].orderStatus],
          'form.comments': res.data[0].comments
        })
      }
    })
  },

  bindStatusChange: function (e) {
    const status = e.detail.value
    this.setData({
      'form.statusIndex': status
    })
    if (status === '0') this.setData({ verifyPass: true})
    else this.setData({ verifyPass: false })
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
    Object.assign(data, { id }, { orderStatus: statusMapping[this.data.form.statusIndex]}, {expressCompany: this.data.form.expressIndex});
    console.log(data);
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
          wx.navigateTo({
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