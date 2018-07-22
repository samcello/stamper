var config = require('../../config')
var util = require('../../utils/util.js')
const App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  login(e) {
    const that = this
    const data = e.detail.value
    const openId = wx.getStorageSync('openId')
    Object.assign(data, {openId})
    wx.request({
      url: config.service.adminLoginUrl,
      data,
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        if(res.data) {
          wx.redirectTo({
            url: '/pages/admin/home/home'
          })
        } else {
          wx.redirectTo({
            url: '/pages/client/home/home'
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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