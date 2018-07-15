var config = require('../../../config')
var util = require('../../../utils/util.js')
const App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fetchTypes: [
      { name: '快递', value: 0, checked: true },
      { name: '送货上门', value: 1, checked: false},
    ],
    payTypes: [
      { name: '微信', value: 0, checked: true },
      { name: '线下支付', value: 2, checked: false }
    ],
    receiverAddress:"",
    totalPrice: 0,
    submitted: false,
    region: ["浙江省", "杭州市", "上城区"],
    receiverName: "",
    receiverPhone: ""
  },
  preData: {},

  fetchTypeChange: function (e) {
    var fetchTypes = this.data.fetchTypes;
    for (var i = 0, len = fetchTypes.length; i < len; ++i) {
      fetchTypes[i].checked = fetchTypes[i].value == e.detail.value;
    }

    this.setData({
      fetchTypes
    });
  },

  payTypeChange: function(e) {
    var payTypes = this.data.payTypes;
    for (var i = 0, len = payTypes.length; i < len; ++i) {
      payTypes[i].checked = payTypes[i].value == e.detail.value;
    }

    this.setData({
      payTypes
    });
  },

  apply(e) {
    const that = this
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
    wx.showModal({
      title: '确认提交',
      content: '申请人承诺以上材料真实有效, 没有虚假',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          that.setData({
            submitted: true
          })
          wx.showLoading({
            title: '处理中',
            mask: true,
          })
          const openId = wx.getStorageSync('openId')
          let requestUrl = null
          if(that.preData.order) {
            requestUrl = config.service.updateOrderUrl;
            Object.assign(data, { id: that.preData.order.id})
            delete that.preData.order
          } else {
            requestUrl = config.service.applyUrl
          }
          Object.assign(data, 
            that.preData, 
            { payStatus: 0 }, 
            { userId: openId }, 
            { receiverRegion: data.receiverRegion.join('|') }, 
            {orderStatus: 1}
          );
          wx.request({
            url: requestUrl,
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
        } else {
          return false
        }
      }
    });
  },

  changeRegin(e) {
    this.setData({ region: e.detail.value });
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
    console.log(options)
    this.preData = JSON.parse(options.stampData)
    this.setData({
      totalPrice: this.preData.totalPrice,
      preData: this.preData
    }) 
    if(this.preData.order) {
      const order = this.preData.order
      this.data.fetchTypes.forEach((fetchType) => {
        if (fetchType.value === order.fetchType) fetchType.checked = true
        else fetchType.checked = false
      })
      this.data.payTypes.forEach((payType) => {
        if(payType.value === order.payType) payType.checked = true
        else payType.checked = false
      })
      this.data.receiverRegion = order.receiverRegion.split('|')
      this.setData({
        'fetchTypes': this.data.fetchTypes,
        'payTypes': this.data.payTypes,
        'receiverAddress': order.receiverAddress,
        'receiverRegion': this.data.receiverRegion,
        'receiverName': order.receiverName,
        'receiverPhone': order.receiverPhone
      })
    }
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