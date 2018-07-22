var config = require('../../../config')
var util = require('../../../utils/util.js')
let dict = require('../../../utils/dict.js')
const statusMapping = {
  0: 99,
  1: 1,
  2: 4,
  3: 5
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      activeStatus: 99,
      searchText: ''
    },
    activeIndex: 0,
    orderStatus: ["所有", "审核中", "已发货", '已退回'],
    navList: [
      { _id: 99, name: '所有' },
      { _id: 1, name: '审核中' },
      { _id: 4, name: '已发货' },
      { _id: 5, name: '已退回'},
    ]
  },
  onTapTag(e) {
    const type = e.currentTarget.dataset.type
    const index = e.currentTarget.dataset.index
    this.setData({
      activeIndex: index,
      'form.activeStatus': type
    })
    this.filterOrders()
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      'form.searchText': "",
      inputShowed: false
    });
    this.filterOrders()    
  },
  clearInput: function () {
    this.setData({
      'form.searchText': ''
    });
    this.filterOrders()
  },
  inputTyping: function (e) {
    this.setData({
      'form.searchText': e.detail.value
    });
    this.filterOrders()
  },

  filterOrders() {
    const that = this
    const parameters = {
      orderStatus: that.data.form.activeStatus,
      searchText: that.data.form.searchText
    }

    wx.request({
      url: config.service.getOrdersUrl,
      header: {
        'content-type': 'application/json'
      },
      data: parameters,
      success: function (res) {
        for (let order of res.data) {
          order.createdTime = util.formatTime(new Date(order.createdTime))
          order.fetchType = dict.fetchTypes[order.fetchType]
          order.orderStatusText = dict.orderStatus[order.orderStatus]
          order.expressInfo = `${dict.expressCompany[order.expressCompany]}/${order.expressNo}`
        }
        that.setData({
          orders: res.data
        })
      }
    })
  },
  redirectTo(e) {
    let orderId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/admin/detail/detail?orderId='+orderId
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.filterOrders()
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