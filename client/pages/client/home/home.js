var config = require('../../../config')
var util = require('../../../utils/util.js')
let dict = require('../../../utils/dict.js')

let data = {
  orders: {
    offset: 0,
    limit: 10,
    hasMore: false,
    dataList: []
  }
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
    this.fetchOrders()
  },

  fetchOrders() {
    let that = this;
    wx.showNavigationBarLoading()
    const openId = wx.getStorageSync('openId');
    const data = {
      openId,
      pagination: {
        limit: that.data.orders.limit,
        offset: that.data.orders.offset
      }
    }
    wx.request({
      url: config.service.getOrdersByUser,
      data,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        for (let order of res.data) {
          order.createdTime = util.formatTime(new Date(order.createdTime))
          order.fetchType = dict.fetchTypes[order.fetchType]
          order.orderStatusText = dict.orderStatus[order.orderStatus]
          order.expressInfo = `${dict.expressCompany[order.expressCompany]}/${order.expressNo}`
        }
        let hasMore = true
        let offset = that.data.orders.offset
        if (res.data.length < that.data.orders.limit) {
          hasMore = false
        } else {
          offset = that.data.orders.offset + that.data.orders.limit
        }
        that.setData({
          orders: {
            limit: that.data.orders.limit,
            offset,
            dataList: [...that.data.orders.dataList, ...res.data],
            hasMore
          }
        })
      },
      complete: function () {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
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
    App.otherStamps = []
    wx.navigateTo({
      url: '/pages/client/apply/apply',
    })
  },

  redirectTo(e) {
    let orderId = e.currentTarget.dataset.id
    let status = e.currentTarget.dataset.status
    if (status != 5 ) return;
    wx.navigateTo({
      url: '/pages/client/apply/apply?orderId=' + orderId
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
    this.setData({
      orders: {
        offset: 0,
        limit: 10,
        hasMore: false,
        dataList: []
      }
    })
    this.fetchOrders()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.orders.hasMore) {
      this.fetchOrders()
    } else {
      wx.showToast({
        title: '没有更多数据',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})