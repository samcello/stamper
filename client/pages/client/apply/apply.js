const config = require('../../../config')
const util = require('../../../utils/util.js')
const dict = require('../../../utils/dict.js')
const App = getApp()

let data = {
  form: {
    companyName: '',
    // legalEntity: '',
    // creditCode: '',
    businessLicenseUrl: '',
    legalIdUrl: '',
    // legalIdFrontUrl: '',
    // legalIdBackUrl: '',
    stampTypes: '',
    contractNum: 1,
    minusStatus: 'disabled'
  },
  order: {},
  stampTypes: [
    { name: '法人章', value: '0', price: '20.00', checked: false },
    { name: '财务专用章', value: '1', price: '30.00', checked: false },
    { name: '法定名称章', value: '2', price: '80.00', checked: false },
    { name: '发票专用章', value: '3', price: '80.00', checked: false },
    { name: '合同专用章', value: '4', price: '80.00', checked: false, multi: true },
    
  ],
  stampAttachments: [
    { label: '营业执照(副本)扫描件', name: 'businessLicenseUrl', value: '0', sampleUrl: 'https://www.itkedian.com/yyzz.jpg', url: '' },
    { label: '法人身份证原件(正反面)', name: 'legalIdUrl', value: '1', sampleUrl: 'https://www.itkedian.com/id.jpg', url: '' },
    { label: '法人或经办人自拍照', name: 'selfieUrl', value: '2', sampleUrl: '', url: ''},
    { label: '委托书', name: 'mandateUrl', value: '3', sampleUrl: '', url: '' },    
    { label: '其它证明文件', name: 'otherUrl', value: '4', sampleUrl: '', url: '' },    
  ],
  submitted: false,
  otherStampTypes:[],
  otherStampText:''
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    this.orderId = options.orderId
    if(this.orderId) {
      wx.request({
        url: config.service.getOrderUrl,
        header: {
          'content-type': 'application/json'
        },
        data: { id: that.orderId },
        success: function (res) {
          let order = res.data[0] || {}
          that.order = order
          let stampTypes = order.stampTypes.split('|')
          for (let stampType of that.data.stampTypes) {
            if (stampTypes.includes(stampType.value)) stampType.checked = true
          }
          let stampAttachments = [
            { label: '营业执照(副本)扫描件', name: 'businessLicenseUrl', value: '0', url: order.businessLicenseUrl, sampleUrl: 'https://www.itkedian.com/yyzz.jpg' },
            { label: '法人身份证原件(正反面)', name: 'legalIdUrl', value: '1', url: order.legalIdUrl, sampleUrl: 'https://www.itkedian.com/id.jpg' },
            { label: '法人或经办人自拍照', name: 'selfieUrl', value: '2', url: order.selfieUrl },
            { label: '委托书', name: 'mandateUrl', value: '3', url: order.mandateUrl },
            { label: '其它证明文件', name: 'otherUrl', value: '4', url: order.mandateUrl },
          ];
          let otherStampSize = 0;
          let otherStampTypes = []
          if (order.otherStampTypes) {
            otherStampTypes = order.otherStampTypes.split('|')
            otherStampSize = otherStampTypes.length
            App.otherStamps = order.otherStampTypes.split('|')
          }
          that.setData({
            'form.companyName': order.companyName,
            'stampTypes': that.data.stampTypes,
            'form.contractNum': order.contractNum,
            'stampAttachments': stampAttachments,
            otherStampTypes,
            otherStampSize
          })
        }
      })
    }

    this.WxValidate = App.WxValidate({
      companyName: {
        required: true
      },
      stampTypes: {
        required: true        
      }
    }, 
    {
        companyName: {
          required: '请输入企业名称',
        },
        stampTypes: {
          required: '请选择需要刻的章'
        }
    })
  },
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
            res = JSON.parse(res.data)
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
    this.setData({
      submitted: true
    })
    wx.showLoading({
      title: '处理中',
      mask: true,
    })
    var stampAttachments = this.data.stampAttachments
    for (var i = 0, lenI = stampAttachments.length; i < lenI; ++i) {
      if (stampAttachments[i].url !=='')
        data[stampAttachments[i].name] = stampAttachments[i].url
    }
    data['stampTypes'] = data['stampTypes'].join('|')
    data['totalPrice'] = this.data.stampTypes.reduce((result, steampType) => {
      if (steampType.checked) result = result + Number(steampType.price)
      if (steampType.multi === true) result = result + Number(steampType.price) * (this.data['form'].contractNum -1)
      return result
    },0)
    if (this.data.otherStampTypes && this.data.otherStampTypes.length != 0) {
      data['totalPrice'] = data['totalPrice'] + 80 * this.data.otherStampTypes.length
    }
    data['contractNum'] = this.data['form'].contractNum
    data['otherStampTypes'] = this.data.otherStampTypes.join('|')
    if(this.orderId) {
      data['order'] = this.order
    }
    wx.navigateTo({
      url: '/pages/client/submit/submit?stampData='+JSON.stringify(data),
      success: function() {
        that.setData({
          submitted: false
        })
        wx.hideLoading()
      }
    })
  },

  bindMinus: function () {
    var contractNum = this.data.form.contractNum;
    if (contractNum > 1) {
      contractNum--;
    }
    var minusStatus = contractNum <= 1 ? 'disabled' : 'normal';
    this.setData({
      'form.contractNum':contractNum,
      minusStatus
    });
  },
  bindPlus: function () {
    var contractNum = this.data.form.contractNum;
    contractNum++;
    var minusStatus = contractNum < 1 ? 'disabled' : 'normal';
    this.setData({
      'form.contractNum':contractNum,
      minusStatus
    });
  },
  bindManual: function (e) {
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
    const otherStamps = App.otherStamps
    if(otherStamps) {
      this.setData({
        otherStampSize: otherStamps.length,
        otherStampTypes: otherStamps
      })
    }
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
    App.otherStamps = '';
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