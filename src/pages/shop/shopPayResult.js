// pages/shop/shopPayResult.js
var buyCardService = require('../../service/buyCardService.js');
var util = require('../../utils/util.js');
var app = getApp();
var recordTimeInterval = "";
const QRCode = require('../../utils/weapp-qrcode.js')
const rate = wx.getSystemInfoSync().windowWidth / 750
// 300rpx 在6s上为 150px
const qrcodeWidth = 300 * rate
let qrcode;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    second: 3,
    showMer: false,
    order: null,
    num: '',
    items: [],
    centerName: null,
    showgoods: true,
    qrcodeWidth: qrcodeWidth,
    image: '',
    imgsrc:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(app.globalData.selectCenter)
    var ismoney = options.ismoney ? options.ismoney : true
    var orderId = options.orderId
    buyCardService.getShopOrder(orderId, ismoney).then(res => {
      res.order.createTime = (util.getdates(res.order.createTime)).split('.')
      this.setData({
        order: res.order,
        num: res.order.id,
        items: res.items,
        centerName: app.globalData.selectCenter.name,
        centerphoto: app.globalData.selectCenter.photo || wx.getStorageSync('selectCenterKey').photo
      })
      var color = res.order.taken ?'#999999':'#000000'
      qrcode = new QRCode('canvas', {
        text: res.order.id+'',
        image: '',
        width: qrcodeWidth,
        height: qrcodeWidth,
        colorDark: color,
        colorLight: "white",
        correctLevel: QRCode.CorrectLevel.H,
      });


    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this
    recordTimeInterval = setInterval(function() {
      var second = that.data.second - 1
      that.setData({
        second: second
      })
      if (second == 0) {
        clearInterval(recordTimeInterval);
        recordTimeInterval = ""
        that.setData({
          showMer: true
        })
      }

    }, 1000)
  },
  show() {
    if(!this.data.imgsrc){
      setTimeout(() => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: this.data.qrcodeWidth,
          height: this.data.qrcodeWidth,
          destWidth: this.data.qrcodeWidth,
          destHeight: this.data.qrcodeWidth,
          canvasId: 'canvas',
          success: res => {
            this.setData({
              imgsrc: res.tempFilePath
            })
          },

        })
      }, 200)
    }
   
    this.setData({
      showgoods: !this.data.showgoods
    })
  },
  close: function() {
    this.setData({
      showMer: false
    })
  },
  goGet: function() {
    this.setData({
      showMer: true
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})