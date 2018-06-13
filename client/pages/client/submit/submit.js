var config = require('../../../config')
var util = require('../../../utils/util.js')
const App = getApp()

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
    ],
    receiverAddress:"",
    totalPrice: 0
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
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      App.WxService.showModal({
        title: '友情提示',
        content: `${error.msg}`,
        showCancel: !1,
      })
      return false
    }
    Object.assign(data, this.preData);
    wx.request({
      url: config.service.applyUrl, 
      data,
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        util.showSuccess("订单提交成功!");
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/client/home/home',
          })
        }, 1500)
      }
    })
  },

  chooseLocation() {
    let that = this
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          receiverAddress: res.address
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.preData = JSON.parse(options.stampData)
    this.setData({
      totalPrice: this.preData.totalPrice,
      preData: this.preData
    }) 
    console.log(this.preData)
    this.WxValidate = App.WxValidate({
      receiverName: {
        required: true,
      },
      receiverPhone: {
        required: true,
        tel: true
      },
      receiverAddress: {
        required: true
      },
    }, {
        receiverName: {
          required: '请输入收件人姓名',
        },
        receiverPhone: {
          required: '请输入收件人电话',
        },
        receiverAddress: {
          required: '请输入收件人地址',
        },
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