var config = require('../../../config')
var util = require('../../../utils/util.js')
let dict = require('../../../utils/dict.js')

let data = {
  orders: []
}
let startTime;
let endTime;

Page({

  /**
   * 页面的初始数据
   */
  data: data,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    const openId = wx.getStorageSync('openId');
    wx.request({
      url: config.service.getOrdersByUser,
      data: {openId},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        for(let order of res.data) {
          order.createdTime = util.formatTime(new Date(order.createdTime))
          order.fetchType = dict.fetchTypes[order.fetchType]
          order.orderStatus = dict.orderStatus[order.orderStatus]
          order.expressInfo = `${dict.expressCompany[order.expressCompany]}/${order.expressNo}`
        }
        that.setData({
          orders: res.data
        })
      }
    })
  },

  bindTap: function (e) {
    if (this.endTime - this.startTime > 5000) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  bindTouchStart(e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd(e) {
    this.endTime = e.timeStamp;
  },
  gotoApply() {
    wx.navigateTo({
      url: '/pages/client/apply/apply',
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