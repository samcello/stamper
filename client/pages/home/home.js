var config = require('../../config')
var util = require('../../utils/util.js')

let data = {
  orders: []
}

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
    wx.request({
      url: config.service.getAllUrl,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        for(let order of res.data) {
          order.createdTime = util.formatTime(new Date(order.createdTime))
        }
        that.setData({
          orders: res.data
        })
      }
    })
  },

  bindgetuserinfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      wx.login({
        success: res => {
          console.log(res.code, e.detail.iv, e.detail.encryptedData)
          wx.getUserInfo({
            success:function(res){
              console.log(res)
            }
          })
        }
      })
    } else {
      console.log(333, '执行到这里，说明拒绝了授权')
      wx.showToast({
        title: "为了您更好的体验,请先同意授权",
        icon: 'none',
        duration: 2000
      });
    }
  },

  gotoApply() {
    wx.redirectTo({
      url: '/pages/apply/apply',
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