const App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    otherStampTypes: [
      { name: '人事专用章', value: '0', price: '80.00', checked: false },
      { name: '行政专用章', value: '1', price: '80.00', checked: false },
      { name: '报关专用章', value: '2', price: '80.00', checked: false },
      { name: '中英文翻译章', value: '3', price: '80.00', checked: false },
      { name: '质检专用章', value: '4', price: '80.00', checked: false },
    ],
  },

  checkboxChange(e) {
    var stampTypes = this.data.otherStampTypes, values = e.detail.value;
    for (var i = 0, lenI = stampTypes.length; i < lenI; ++i) {
      stampTypes[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (stampTypes[i].value == values[j]) {
          stampTypes[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      otherStampTypes: stampTypes
    });
  },

  apply(e){
    const selections = this.data.otherStampTypes.filter((stampType) => {
      return stampType.checked
    }).map(stampType => {
      return stampType.value
    })

    App.otherStamps = selections
    wx.navigateBack({
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(App.otherStamps) {
      const otherStamps = App.otherStamps
      for (let stampType of this.data.otherStampTypes) {
        stampType.checked = otherStamps.includes(stampType.value)
      }
      this.setData({
        otherStampTypes: this.data.otherStampTypes
      })
    }
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