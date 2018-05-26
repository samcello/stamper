var config = require('../../config')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fetchTypes: [
      { name: '自取', value: 0, checked: true },
      { name: '快递', value: 1, checked: false},
    ],
    payTypes: [
      { name: '微信', value: 0, checked: true }
    ]
  },
  preData: {},

  radioChange: function (e) {
    var fetchTypes = this.data.fetchTypes;
    for (var i = 0, len = fetchTypes.length; i < len; ++i) {
      fetchTypes[i].checked = fetchTypes[i].value == e.detail.value;
    }

    this.setData({
      fetchTypes
    });
  },

  apply(e) {
    const data = e.detail.value
    console.log(data)
    Object.assign(data, this.preData);
    wx.request({
      url: config.service.applyUrl, 
      data,
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        wx.redirectTo({
          url: '/pages/home/home'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.preData = JSON.parse(options.stampData)
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