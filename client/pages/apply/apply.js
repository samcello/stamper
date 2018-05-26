var config = require('../../config')
var util = require('../../utils/util.js')

let data = {
  stampTypes: [
    { name: '公章', value: '0', checked: false },
    { name: '发票章', value: '1', checked: false },
    { name: '财务章', value: '2', checked: false },
    { name: '法人章', value: '3', checked: false },
    { name: '合同章', value: '4', checked: false}
  ],
  stampAttachments: [
    { label: '营业执照', name: 'businessLicenseUrl', value: '0', sampleUrl: '../../assets/vr.png', url: '' },
    { label: '法人身份证-正面', name: 'legalIdFrontUrl', value: '1', sampleUrl: '', url: '' },
    { label: '法人身份证-反面', name: 'legalIdBackUrl', value: '2', sampleUrl: '', url: ''}
  ]
};

function updateAttachments(attachType, data, url) {
  var stampAttachments = data.stampAttachments
  for (var i = 0, lenI = stampAttachments.length; i < lenI; ++i) {
    if( stampAttachments[i].value === attachType )
      stampAttachments[i].url = url
  }
  return stampAttachments;
}

Page({

  /**
   * 页面的初始数据
   */
  data: data,
  // 上传图片接口
  doUpload: function (e) {
    var that = this
    let attachType = e.currentTarget.dataset.attachType
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        util.showBusy('正在上传')
        var filePath = res.tempFilePaths[0]
        // 上传图片
        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: filePath,
          name: 'file',

          success: function (res) {
            util.showSuccess('上传图片成功')
            console.log(res)
            res = JSON.parse(res.data)
            console.log(res)
            const stampAttachments = updateAttachments(attachType, that.data, res.data.imgUrl);
            that.setData({
              stampAttachments
            })
          },

          fail: function (e) {
            util.showModel('上传图片失败')
          }
        })

      },
      fail: function (e) {
        console.error(e)
      }
    })
  },

  // 预览图片
  previewImg: function (e) {
    const previewUrl = e.currentTarget.dataset.previewUrl
    console.log(previewUrl);
    wx.previewImage({
      current: previewUrl,
      urls: [previewUrl]
    })
  },

  checkboxChange: function (e) {
    var stampTypes = this.data.stampTypes, values = e.detail.value;
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
      stampTypes
    });
  },

  apply: function(e) {
    const data = e.detail.value
    console.log(data);
    var stampAttachments = this.data.stampAttachments
    for (var i = 0, lenI = stampAttachments.length; i < lenI; ++i) {
      if (stampAttachments[i].url !=='')
        data[stampAttachments[i].name] = stampAttachments[i].url
    }
    data['stampTypes'] = data['stampTypes'].join('|')
    wx.navigateTo({
      url: '/pages/submit/submit?stampData='+JSON.stringify(data)
    })
    // console.log(data)
    // wx.request({
    //   url: config.service.applyUrl, 
    //   data,
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   method: 'POST',
    //   success: function (res) {
    //     console.log(res.data)
    //     wx.navigateTo({
    //       url: '/pages/submit/submit'
    //     })
    //   }
    // })
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